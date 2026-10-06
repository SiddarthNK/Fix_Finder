import pytest
from backend.app.vector_store import vector_store

def test_feedback_loop_new_case_ranks_first():
  unique_complaint = "Extremely weird squeaking sound in cryogenic freezer pump 99"
  real_cause = "Cryogenic seals friction imbalance"

  new_case = {
    "case_id": "CASE-999-TEST",
    "equipment_type": "Water Pump",
    "model": "Cryo Pump X",
    "building": "Building B",
    "floor": 2,
    "complaint_text": unique_complaint,
    "symptoms": ["cryogenic squeaking", "pump friction"],
    "root_cause": real_cause,
    "fix_applied": "Replaced cryo seal ring",
    "parts_replaced": ["Cryo Ring"],
    "cost_inr": 4500,
    "downtime_hrs": 3.0,
    "urgency": "P1"
  }

  vector_store.add_case(new_case)

  # Re-run search for same complaint
  matched = vector_store.search(unique_complaint, equipment_type="Water Pump", top_k=5)
  assert len(matched) > 0
  assert matched[0]["case_id"] == "CASE-999-TEST"
  assert matched[0]["root_cause"] == real_cause
