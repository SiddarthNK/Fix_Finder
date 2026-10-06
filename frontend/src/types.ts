export interface IntakeOutput {
  equipment_type: string;
  building: string;
  floor: number;
  symptoms: string[];
  severity_cues: string[];
}

export interface MatchedCase {
  case_id: string;
  equipment_type: string;
  model: string;
  building: string;
  floor: number;
  complaint_text: string;
  symptoms: string[];
  root_cause: string;
  fix_applied: string;
  parts_replaced: string[];
  cost_inr: number;
  downtime_hrs: number;
  urgency: string; // P1, P2, P3, P4
  similarity_score: number;
}

export interface RetrievalOutput {
  query_symptoms: string[];
  equipment_type: string;
  matched_cases: MatchedCase[];
}

export interface LikelyCause {
  cause: string;
  confidence: number;
  supporting_cases: string[];
}

export interface DiagnosisOutput {
  likely_causes: LikelyCause[];
  reasoning: str;
  disagreement?: string | null;
  missing_info: string[];
  plain_summary: string;
  is_no_precedent: boolean;
}

export interface RecommendationOutput {
  fix_steps: string[];
  parts_needed: string[];
  median_cost_inr: number;
  cost_range_inr: string;
  median_downtime_hrs: number;
  downtime_range_hrs: string;
  urgency: string; // P1, P2, P3, P4
  urgency_reason: string;
}

export interface PipelineResult {
  intake: IntakeOutput;
  retrieval: RetrievalOutput;
  diagnosis: DiagnosisOutput;
  recommendation?: RecommendationOutput | null;
  timings_ms: Record<string, number>;
}

export interface SSEEvent {
  event: 'node_start' | 'node_finish' | 'pipeline_complete';
  node?: 'intake' | 'retrieval' | 'diagnosis' | 'recommendation';
  message?: string;
  output?: any;
  duration_ms?: number;
  result?: PipelineResult;
}

export interface SettingsModel {
  similarity_threshold: number;
  auto_escalate: boolean;
  theme: string;
  local_only: boolean;
}

export interface ActivityLogItem {
  id: number;
  timestamp: string;
  agent_name: string;
  complaint_text: string;
  building: string;
  equipment_type: string;
  diagnosed_cause: string;
  urgency: string;
  similarity_score: number;
  cited_case_ids: string;
  status: string;
}
