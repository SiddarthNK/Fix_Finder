import json
import asyncio
from fastapi import FastAPI, Query, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import Optional, List, Dict, Any

from .config import DATA_DIR
from .database import init_db, get_settings, update_settings, get_activity_logs, log_agent_activity
from .models import ComplaintRequest, FeedbackRequest, SettingsModel, BatchRequest
from .vector_store import vector_store
from .pipeline import pipeline_engine

app = FastAPI(
  title="FixFinder AI Facility Decision-Support Agent API",
  version="1.0.0"
)

# CORS Enablement for Frontend
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
  init_db()

@app.get("/health")
def health_check():
  return {"status": "ok", "cases_loaded": len(vector_store.cases)}

# ----------------------------------------------------
# POST /diagnose (SSE Stream)
# ----------------------------------------------------
@app.post("/diagnose")
async def stream_diagnose(req: ComplaintRequest):
  """
  Stream each node's start/finish and output to the frontend over Server-Sent Events (SSE).
  """
  def event_generator():
    for event in pipeline_engine.run_pipeline_step_by_step(
      complaint_text=req.complaint_text,
      target_building=req.building or "Building A",
      floor=req.floor or 1
    ):
      # Format as standard SSE
      event_type = event.get("event", "message")
      data_json = json.dumps(event)
      yield f"event: {event_type}\ndata: {data_json}\n\n"

  return StreamingResponse(event_generator(), media_type="text/event-stream")

# ----------------------------------------------------
# POST /batch (3+ complaints, sorted by urgency)
# ----------------------------------------------------
@app.post("/batch")
def batch_triage(req: BatchRequest):
  """
  Auto-diagnose a batch of complaints and sort by Urgency (P1 Critical first).
  """
  results = []
  urgency_rank = {"P1": 1, "P2": 2, "P3": 3, "P4": 4}

  for c in req.complaints:
    # Run synchronously for batch summary
    generator = pipeline_engine.run_pipeline_step_by_step(c.complaint_text, c.building or "Building A", c.floor or 1)
    last_complete = None
    for evt in generator:
      if evt.get("event") == "pipeline_complete":
        last_complete = evt.get("result")

    if last_complete:
      rec = last_complete.get("recommendation")
      diag = last_complete.get("diagnosis")
      intake = last_complete.get("intake")
      urgency = rec.get("urgency", "P3") if rec else "P3"
      
      results.append({
        "complaint": c.complaint_text,
        "building": c.building or "Building A",
        "floor": c.floor or 1,
        "equipment_type": intake.get("equipment_type", "General") if intake else "General",
        "cause": diag.get("likely_causes", [{}])[0].get("cause", "Pending") if diag.get("likely_causes") else "Uncertain",
        "urgency": urgency,
        "cost_inr": rec.get("median_cost_inr", 0) if rec else 0,
        "downtime_hrs": rec.get("median_downtime_hrs", 0) if rec else 0,
        "result": last_complete
      })

  # Sort by urgency rank (P1 first)
  results.sort(key=lambda x: urgency_rank.get(x["urgency"], 4))
  return {"batch_count": len(results), "triage_queue": results}

# ----------------------------------------------------
# POST /feedback (Embed and append to Chroma immediately)
# ----------------------------------------------------
@app.post("/feedback")
def submit_feedback(fb: FeedbackRequest):
  """
  Technician confirms or corrects diagnosis.
  Saves to active vector store immediately so re-running ranks new case #1!
  """
  cases = vector_store.cases
  new_id = f"CASE-{len(cases) + 1:03d}"

  new_case = {
    "case_id": new_id,
    "equipment_type": fb.equipment_type or "AC",
    "model": "Technician Verified Unit",
    "building": fb.building or "Building A",
    "floor": 1,
    "complaint_text": fb.complaint_text,
    "symptoms": ["technician_confirmed"],
    "root_cause": fb.real_cause if (not fb.confirmed and fb.real_cause) else "Confirmed as Diagnosed",
    "fix_applied": " ".join(fb.fix_steps) if fb.fix_steps else "Applied field repair according to diagnosis.",
    "parts_replaced": ["Technician Replacement Part"],
    "cost_inr": fb.cost_inr or 3500.0,
    "downtime_hrs": fb.downtime_hrs or 2.0,
    "urgency": "P1",
    "date_reported": "Just now",
    "technician": "Verified Field Tech"
  }

  vector_store.add_case(new_case)

  log_agent_activity(
    agent_name="Technician Feedback Agent",
    complaint_text=fb.complaint_text,
    building=fb.building or "Building A",
    equipment_type=fb.equipment_type or "AC",
    cause=new_case["root_cause"],
    urgency="P1",
    score=1.0,
    cited_cases=[new_id],
    status="Confirmed & Embedded" if fb.confirmed else "Corrected & Embedded"
  )

  return {
    "status": "success",
    "message": f"Case {new_id} embedded into Chroma vector store.",
    "new_case": new_case
  }

# ----------------------------------------------------
# GET /cases
# ----------------------------------------------------
@app.get("/cases")
def search_cases(query: Optional[str] = "", equipment: Optional[str] = "All"):
  matched = vector_store.search(query_text=query or "", equipment_type=equipment, top_k=50)
  return {"count": len(matched), "cases": matched}

# ----------------------------------------------------
# GET /insights (Building/equipment breakdowns & pattern alerts)
# ----------------------------------------------------
@app.get("/insights")
def get_insights():
  cases = vector_store.cases
  building_counts = {}
  equipment_counts = {}
  pattern_clusters = {}

  for c in cases:
    b = c.get("building", "Building A")
    eq = c.get("equipment_type", "General")
    building_counts[b] = building_counts.get(b, 0) + 1
    equipment_counts[eq] = equipment_counts.get(eq, 0) + 1

    key = f"{b} - {eq}"
    if key not in pattern_clusters:
      pattern_clusters[key] = {"building": b, "equipment": eq, "count": 0, "causes": []}
    pattern_clusters[key]["count"] += 1
    cause = c.get("root_cause", "")
    if cause and cause not in pattern_clusters[key]["causes"]:
      pattern_clusters[key]["causes"].append(cause)

  # Filter pattern alerts (seen >= 5 times)
  alerts = [p for p in pattern_clusters.values() if p["count"] >= 5]

  return {
    "total_cases": len(cases),
    "by_building": building_counts,
    "by_equipment": equipment_counts,
    "pattern_alerts": alerts
  }

# ----------------------------------------------------
# GET /log
# ----------------------------------------------------
@app.get("/log")
def get_logs():
  return {"logs": get_activity_logs(limit=50)}

# ----------------------------------------------------
# GET & PUT /settings
# ----------------------------------------------------
@app.get("/settings")
def read_settings():
  return get_settings()

@app.put("/settings")
def save_settings(s: SettingsModel):
  updated = update_settings(s.model_dump())
  return {"status": "updated", "settings": updated}
