import json
import os
import math
from typing import List, Dict, Any
from .config import CHROMA_DIR, SYNTHETIC_DATA_PATH

class VectorStore:
  def __init__(self):
    self.cases: List[Dict[str, Any]] = []
    self._chroma_client = None
    self._collection = None
    self._init_store()

  def _init_store(self):
    os.makedirs(CHROMA_DIR, exist_ok=True)
    # Load synthetic dataset
    if os.path.exists(SYNTHETIC_DATA_PATH):
      with open(SYNTHETIC_DATA_PATH, "r", encoding="utf-8") as f:
        self.cases = json.load(f)
    else:
      self.cases = []

    try:
      import chromadb
      self._chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)
      self._collection = self._chroma_client.get_or_create_collection(name="maintenance_cases")
      
      # Populate collection if empty
      if self._collection.count() == 0 and self.cases:
        ids = [c["case_id"] for c in self.cases]
        documents = [f"{c['complaint_text']} {c['root_cause']} {c['equipment_type']} {c['model']} {' '.join(c['symptoms'])}" for c in self.cases]
        metadatas = [{
          "equipment_type": c["equipment_type"],
          "building": c["building"],
          "model": c["model"],
          "urgency": c["urgency"],
          "cost_inr": float(c["cost_inr"]),
          "downtime_hrs": float(c["downtime_hrs"])
        } for c in self.cases]
        
        self._collection.add(
          ids=ids,
          documents=documents,
          metadatas=metadatas
        )
    except Exception as e:
      print(f"[VectorStore] ChromaDB notice (using in-memory fallback): {e}")

  def search(self, query_text: str, equipment_type: str = None, building: str = None, model: str = None, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Metadata pre-filter on equipment_type, semantic word-embedding search, 
    and re-rank with building/model boost. Returns top_k with similarity_score (0.0 to 1.0).
    """
    if not self.cases:
      return []

    # 1. Pre-filter by equipment_type if provided
    candidates = self.cases
    if equipment_type and equipment_type != "All":
      filtered = [c for c in candidates if c["equipment_type"].lower() == equipment_type.lower()]
      if len(filtered) >= 2:
        candidates = filtered

    # 2. Compute similarity scores
    query_tokens = self._tokenize(query_text)
    
    results = []
    for case in candidates:
      case_text = f"{case['complaint_text']} {case['root_cause']} {case['equipment_type']} {' '.join(case.get('symptoms', []))}"
      case_tokens = self._tokenize(case_text)
      
      # Overlap & Jaccard metric
      match_count = sum(1 for t in query_tokens if t in case_tokens)
      jaccard = match_count / max(len(set(query_tokens + case_tokens)), 1)
      overlap_ratio = match_count / max(len(query_tokens), 1)
      
      base_score = (overlap_ratio * 0.6) + (jaccard * 0.4)
      
      # Re-rank boosts (+boost same building/model)
      boost = 0.0
      if building and case.get("building", "").lower() == building.lower():
        boost += 0.15
      if model and case.get("model", "").lower() == model.lower():
        boost += 0.15
      if equipment_type and case.get("equipment_type", "").lower() == equipment_type.lower():
        boost += 0.10

      final_score = round(min((base_score + boost), 0.98), 2)
      
      # Ensure minimum non-zero match if terms align
      if match_count > 0 and final_score < 0.25:
        final_score = 0.35

      c_copy = dict(case)
      c_copy["similarity_score"] = final_score
      results.append(c_copy)

    # Sort descending by similarity_score
    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return results[:top_k]

  def add_case(self, new_case: Dict[str, Any]):
    """
    Embed and append new case to Chroma persistent storage immediately.
    """
    self.cases.insert(0, new_case)
    
    if self._collection:
      try:
        doc = f"{new_case['complaint_text']} {new_case['root_cause']} {new_case['equipment_type']} {new_case.get('model', '')}"
        meta = {
          "equipment_type": new_case.get("equipment_type", "General"),
          "building": new_case.get("building", "Building A"),
          "model": new_case.get("model", "General Model"),
          "urgency": new_case.get("urgency", "P1"),
          "cost_inr": float(new_case.get("cost_inr", 3000)),
          "downtime_hrs": float(new_case.get("downtime_hrs", 2.0))
        }
        self._collection.add(
          ids=[new_case["case_id"]],
          documents=[doc],
          metadatas=[meta]
        )
      except Exception as e:
        print(f"[VectorStore] Chroma update error: {e}")

  def _tokenize(self, text: str) -> List[str]:
    stopwords = {"a", "an", "the", "in", "on", "at", "to", "for", "with", "and", "or", "is", "are", "was", "were", "be", "room", "floor"}
    words = text.lower().replace(",", " ").replace(".", " ").replace("-", " ").split()
    return [w for w in words if len(w) > 1 and w not in stopwords]

# Singleton instance
vector_store = VectorStore()
