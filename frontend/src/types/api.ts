/** Types mirroring backend/app/schemas (snake_case = FastAPI wire format). */

export type DocumentType = "msa" | "sow" | "nda" | "amendment" | "exhibit";
export type Severity = "critical" | "high" | "medium" | "low";
export type FindingStatus = "open" | "accepted" | "modified" | "rejected";
export type RiskCategory =
  | "payment" | "sla" | "confidentiality" | "ip"
  | "liability" | "termination" | "contradiction";

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ContractDocument {
  id: string;
  family_id: string;
  filename: string;
  title: string;
  doc_type: DocumentType;
  status: "uploaded" | "parsed" | "gated" | "analyzed";
  uploaded_at: string;
}

export interface Clause {
  id: string;
  clause_ref: string;
  section_ref: string;
  section_path: string[];
  title: string;
  text: string;
  clause_type: string;
  page: number;
  extraction_confidence: number;
  evaluability: "evaluable" | "unevaluable";
  document_id: string;
}

export interface Citation {
  document: string;
  clause_ref: string;
  page: number;
  quote: string;
  verified: boolean;
}

export interface RedlineOp {
  op: "equal" | "insert" | "delete";
  text: string;
}

export interface Finding {
  id: string;
  category: RiskCategory;
  severity: Severity;
  summary: string;
  playbook_rule: string;
  citations: Citation[];
  redline: { ops: RedlineOp[]; fallback_source?: string } | null;
  extraction_confidence: number;
  grounding_verified: boolean;
  status: FindingStatus;
  clause_id: string | null;
}

export interface EvidenceGap {
  missing_document: string;
  referenced_from: string[];
  blocked_clause_refs: string[];
  resolved: boolean;
}

export interface GraphNode {
  id: string;
  clause_ref: string;
  clause_type: string;
  document_id: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  edge_type: string;
  trigger_text: string;
}

export interface CycleReport {
  clauses: string[];
  edges: GraphEdge[];
  suggested_break: GraphEdge | null;
}

export interface AuditEvent {
  id: string;
  family_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  prev_hash: string;
  event_hash: string;
  created_at: string;
}

export interface ReportSummary {
  contract_family_id: string;
  generated_at: string;
  findings_total: number;
  findings_by_severity: Record<Severity, number>;
  claims_generated: number;
  claims_verified: number;
  claims_rejected: number;
}

export interface ChatClaim {
  summary: string;
  quote: string;
  clause_ref: string;
  verified?: boolean;
}

export interface ChatAnswer {
  answer: string;
  claims: ChatClaim[];
  refused?: boolean;
  refusal_reason?: string;
}
