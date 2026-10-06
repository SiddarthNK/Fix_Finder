from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ComplaintRequest(BaseModel):
  complaint_text: str = Field(..., description="Free text maintenance complaint")
  building: Optional[str] = Field("Building A", description="Target building")
  floor: Optional[int] = Field(0, description="Floor number")

class IntakeOutput(BaseModel):
  equipment_type: str
  building: str
  floor: int
  symptoms: List[str]
  severity_cues: List[str]

class MatchedCase(BaseModel):
  case_id: str
  equipment_type: str
  model: str
  building: str
  floor: int
  complaint_text: str
  symptoms: List[str]
  root_cause: str
  fix_applied: str
  parts_replaced: List[str]
  cost_inr: float
  downtime_hrs: float
  urgency: str
  similarity_score: float

class RetrievalOutput(BaseModel):
  query_symptoms: List[str]
  equipment_type: str
  matched_cases: List[MatchedCase]

class LikelyCause(BaseModel):
  cause: str
  confidence: float
  supporting_cases: List[str]

class DiagnosisOutput(BaseModel):
  likely_causes: List[LikelyCause]
  reasoning: str
  disagreement: Optional[str] = None
  missing_info: List[str] = []
  plain_summary: str
  is_no_precedent: bool = False

class RecommendationOutput(BaseModel):
  fix_steps: List[str]
  parts_needed: List[str]
  median_cost_inr: float
  cost_range_inr: str
  median_downtime_hrs: float
  downtime_range_hrs: str
  urgency: str  # P1, P2, P3, P4
  urgency_reason: str

class PipelineResult(BaseModel):
  intake: IntakeOutput
  retrieval: RetrievalOutput
  diagnosis: DiagnosisOutput
  recommendation: Optional[RecommendationOutput] = None
  timings_ms: Dict[str, float]

class FeedbackRequest(BaseModel):
  complaint_text: str
  confirmed: bool
  real_cause: Optional[str] = None
  building: Optional[str] = "Building A"
  equipment_type: Optional[str] = "AC"
  cost_inr: Optional[float] = 3500.0
  downtime_hrs: Optional[float] = 2.0
  fix_steps: Optional[List[str]] = None

class SettingsModel(BaseModel):
  similarity_threshold: float = 0.30
  auto_escalate: bool = True
  theme: str = "dark"
  local_only: bool = True

class BatchRequest(BaseModel):
  complaints: List[ComplaintRequest]
