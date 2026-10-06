import pytest
from backend.app.vector_store import vector_store

def test_retrieval_ranking_equipment_prefilter():
  results = vector_store.search("compressor rattling and leaking water", equipment_type="AC", top_k=5)
  assert len(results) > 0
  assert results[0]["equipment_type"] == "AC"
  assert results[0]["similarity_score"] > 0.30

def test_retrieval_ranking_scores_sorted():
  results = vector_store.search("breaker tripping in server room panel", top_k=5)
  scores = [r["similarity_score"] for r in results]
  assert scores == sorted(scores, reverse=True)
