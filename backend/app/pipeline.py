import time
import statistics
from typing import Dict, Any, List, Optional
from .models import (
  IntakeOutput,
  RetrievalOutput,
  DiagnosisOutput,
  RecommendationOutput,
  LikelyCause,
  MatchedCase,
  PipelineResult
)
from .vector_store import vector_store
from .llm_client import llm_client
from .database import get_settings

class LangGraphPipeline:
  def __init__(self):
    pass

  def run_pipeline_step_by_step(self, complaint_text: str, target_building: str = "Building A", floor: int = 1):
    """
    Generator yielding step-by-step SSE events as each node executes.
    State is passed node to node.
    """
    settings = get_settings()
    threshold = settings.get("similarity_threshold", 0.30)
    auto_escalate = settings.get("auto_escalate", True)

    timings = {}
    
    # ----------------------------------------------------
    # NODE 1: INTAKE AGENT
    # ----------------------------------------------------
    t0 = time.time()
    yield {"event": "node_start", "node": "intake", "message": "Intake Agent: Parsing complaint text and extracting equipment cues..."}
    
    intake_res = self._node_intake(complaint_text, target_building, floor)
    t_intake = round((time.time() - t0) * 1000, 2)
    timings["intake"] = t_intake

    yield {"event": "node_finish", "node": "intake", "output": intake_res.model_dump(), "duration_ms": t_intake}

    # ----------------------------------------------------
    # NODE 2: RETRIEVAL AGENT
    # ----------------------------------------------------
    t0 = time.time()
    yield {"event": "node_start", "node": "retrieval", "message": f"Retrieval Agent: Pre-filtering on {intake_res.equipment_type} and vector searching knowledge base..."}

    retrieval_res = self._node_retrieval(complaint_text, intake_res)
    t_retrieval = round((time.time() - t0) * 1000, 2)
    timings["retrieval"] = t_retrieval

    yield {"event": "node_finish", "node": "retrieval", "output": retrieval_res.model_dump(), "duration_ms": t_retrieval}

    # ----------------------------------------------------
    # NODE 3: DIAGNOSIS AGENT
    # ----------------------------------------------------
    t0 = time.time()
    yield {"event": "node_start", "node": "diagnosis", "message": "Diagnosis Agent: Evaluating precedents and checking confidence threshold..."}

    top_score = retrieval_res.matched_cases[0].similarity_score if retrieval_res.matched_cases else 0.0

    if top_score < threshold:
      # REFUSAL STATE: Top similarity < threshold -> "No strong precedent"
      diagnosis_res = DiagnosisOutput(
        likely_causes=[],
        reasoning=f"Highest similarity score ({int(top_score*100)}%) is below the configured confidence threshold ({int(threshold*100)}%).",
        disagreement=None,
        missing_info=["Detailed technician site log", "Component diagnostic telemetry"],
        plain_summary="No strong precedent found in the historical database. Flagged for technician manual inspection.",
        is_no_precedent=True
      )
      t_diag = round((time.time() - t0) * 1000, 2)
      timings["diagnosis"] = t_diag
      yield {"event": "node_finish", "node": "diagnosis", "output": diagnosis_res.model_dump(), "duration_ms": t_diag}

      # Final pipeline completion event with refusal
      yield {
        "event": "pipeline_complete",
        "result": {
          "intake": intake_res.model_dump(),
          "retrieval": retrieval_res.model_dump(),
          "diagnosis": diagnosis_res.model_dump(),
          "recommendation": None,
          "timings_ms": timings
        }
      }
      return

    # Normal diagnosis reasoning over retrieved cases
    diagnosis_res = self._node_diagnosis(complaint_text, intake_res, retrieval_res)
    t_diag = round((time.time() - t0) * 1000, 2)
    timings["diagnosis"] = t_diag

    yield {"event": "node_finish", "node": "diagnosis", "output": diagnosis_res.model_dump(), "duration_ms": t_diag}

    # ----------------------------------------------------
    # NODE 4: RECOMMENDATION AGENT (HYBRID)
    # ----------------------------------------------------
    t0 = time.time()
    yield {"event": "node_start", "node": "recommendation", "message": "Recommendation Agent: Calculating cost/downtime medians and computing urgency rules..."}

    recommendation_res = self._node_recommendation(complaint_text, intake_res, retrieval_res, diagnosis_res, auto_escalate)
    t_rec = round((time.time() - t0) * 1000, 2)
    timings["recommendation"] = t_rec

    yield {"event": "node_finish", "node": "recommendation", "output": recommendation_res.model_dump(), "duration_ms": t_rec}

    # Pipeline Complete Event
    yield {
      "event": "pipeline_complete",
      "result": {
        "intake": intake_res.model_dump(),
        "retrieval": retrieval_res.model_dump(),
        "diagnosis": diagnosis_res.model_dump(),
        "recommendation": recommendation_res.model_dump(),
        "timings_ms": timings
      }
    }

  def _node_intake(self, text: str, building: str, floor: int) -> IntakeOutput:
    prompt = f"Parse this maintenance complaint:\nText: '{text}'\nTarget Building: '{building}'\nFloor: {floor}\nReturn JSON with equipment_type, building, floor, symptoms[], severity_cues[]."
    parsed = llm_client.generate_json(prompt, IntakeOutput)

    return IntakeOutput(
      equipment_type=parsed.get("equipment_type", "AC"),
      building=parsed.get("building", building),
      floor=parsed.get("floor", floor),
      symptoms=parsed.get("symptoms", ["operational fault"]),
      severity_cues=parsed.get("severity_cues", ["standard complaint"])
    )

  def _node_retrieval(self, complaint_text: str, intake: IntakeOutput) -> RetrievalOutput:
    search_query = f"{complaint_text} {' '.join(intake.symptoms)}"
    matched = vector_store.search(
      query_text=search_query,
      equipment_type=intake.equipment_type,
      building=intake.building,
      top_k=5
    )

    matched_models = []
    for c in matched:
      matched_models.append(MatchedCase(
        case_id=c["case_id"],
        equipment_type=c["equipment_type"],
        model=c.get("model", "Standard Model"),
        building=c.get("building", "Building A"),
        floor=c.get("floor", 1),
        complaint_text=c["complaint_text"],
        symptoms=c.get("symptoms", []),
        root_cause=c["root_cause"],
        fix_applied=c.get("fix_applied", "Repaired component"),
        parts_replaced=c.get("parts_replaced", []),
        cost_inr=float(c.get("cost_inr", 3000)),
        downtime_hrs=float(c.get("downtime_hrs", 2.0)),
        urgency=c.get("urgency", "P2"),
        similarity_score=float(c.get("similarity_score", 0.50))
      ))

    return RetrievalOutput(
      query_symptoms=intake.symptoms,
      equipment_type=intake.equipment_type,
      matched_cases=matched_models
    )

  def _node_diagnosis(self, complaint_text: str, intake: IntakeOutput, retrieval: RetrievalOutput) -> DiagnosisOutput:
    # Compile candidate causes from matched cases
    cases_summary = []
    for c in retrieval.matched_cases:
      cases_summary.append(f"[{c.case_id}] (Score: {int(c.similarity_score*100)}%): Cause: '{c.root_cause}'")

    prompt = f"Diagnose complaint: '{complaint_text}'\nRetrieved Historical Precedents:\n" + "\n".join(cases_summary) + "\nOutput JSON matching DiagnosisOutput schema. YOU MAY CITE ONLY RETRIEVED CASE IDs."

    diag_dict = llm_client.generate_json(prompt, DiagnosisOutput)

    # Format likely causes with cited case IDs
    top_case = retrieval.matched_cases[0]
    sec_case = retrieval.matched_cases[1] if len(retrieval.matched_cases) > 1 else None

    causes = [
      LikelyCause(
        cause=top_case.root_cause,
        confidence=top_case.similarity_score,
        supporting_cases=[top_case.case_id]
      )
    ]

    disagreement = None
    if sec_case and (top_case.similarity_score - sec_case.similarity_score < 0.15):
      causes.append(LikelyCause(
        cause=sec_case.root_cause,
        confidence=sec_case.similarity_score,
        supporting_cases=[sec_case.case_id]
      ))
      disagreement = f"Competing diagnostic hypotheses: Check '{sec_case.root_cause}' [{sec_case.case_id}] before closing ticket."

    plain = f"Diagnosed as '{top_case.root_cause}' with {int(top_case.similarity_score*100)}% confidence based on cited historical precedents [{top_case.case_id}]."

    return DiagnosisOutput(
      likely_causes=causes,
      reasoning=diag_dict.get("reasoning", f"Symptom alignment with case {top_case.case_id}."),
      disagreement=disagreement,
      missing_info=[],
      plain_summary=plain,
      is_no_precedent=False
    )

  def _node_recommendation(
    self,
    complaint_text: str,
    intake: IntakeOutput,
    retrieval: RetrievalOutput,
    diagnosis: DiagnosisOutput,
    auto_escalate: bool
  ) -> RecommendationOutput:
    matched = retrieval.matched_cases
    costs = [m.cost_inr for m in matched]
    downtimes = [m.downtime_hrs for m in matched]

    median_cost = round(statistics.median(costs), 2)
    min_cost, max_cost = round(min(costs), 2), round(max(costs), 2)

    median_down = round(statistics.median(downtimes), 1)
    min_down, max_down = round(min(downtimes), 1), round(max(downtimes), 1)

    primary_case = matched[0]
    base_urgency = primary_case.urgency
    urgency_reason = f"Derived from precedent case {primary_case.case_id}."

    # RULE 1: Safety critical equipment bump (Elevator, Generator, Electrical Panel, UPS)
    safety_critical = {"elevator", "generator", "electrical panel", "ups"}
    if intake.equipment_type.lower() in safety_critical and auto_escalate:
      if base_urgency == "P3": base_urgency = "P2"
      elif base_urgency == "P2": base_urgency = "P1"
      urgency_reason = f"Safety-Critical Escalation: Equipment type '{intake.equipment_type}' automatically bumped urgency to {base_urgency}."

    # RULE 2: Multiple open complaints in same building bump
    same_building_count = sum(1 for m in matched if m.building == intake.building)
    if same_building_count >= 2 and auto_escalate and base_urgency != "P1":
      base_urgency = "P1" if base_urgency == "P2" else "P2"
      urgency_reason += f" Recurrence Escalation: {same_building_count} similar complaints detected in {intake.building}."

    fix_steps = [
      primary_case.fix_applied,
      "Verify system operating pressure & electrical load parameters",
      "Inspect associated safety relays & clear error flags"
    ]
    parts = primary_case.parts_replaced if primary_case.parts_replaced else ["OEM Repair Kit"]

    return RecommendationOutput(
      fix_steps=fix_steps,
      parts_needed=parts,
      median_cost_inr=median_cost,
      cost_range_inr=f"₹{min_cost:,.0f} - ₹{max_cost:,.0f}",
      median_downtime_hrs=median_down,
      downtime_range_hrs=f"{min_down} - {max_down} hrs",
      urgency=base_urgency,
      urgency_reason=urgency_reason
    )

# Singleton pipeline
pipeline_engine = LangGraphPipeline()
