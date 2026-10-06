from backend.app.pipeline import pipeline_engine
from backend.app.database import init_db

def test_urgency_safety_critical_escalation():
  init_db()
  # Elevator is safety-critical -> should be P1 or P2
  generator = pipeline_engine.run_pipeline_step_by_step("Elevator B doors closing too rapidly, trapping passengers and ignoring light curtain sensor.", target_building="Building A", floor=1)
  last_result = None
  for evt in generator:
    if evt.get("event") == "pipeline_complete":
      last_result = evt.get("result")

  assert last_result is not None
  rec = last_result["recommendation"]
  assert rec["urgency"] in ["P1", "P2"]
  assert "Safety-Critical" in rec["urgency_reason"] or "precedent" in rec["urgency_reason"].lower()
