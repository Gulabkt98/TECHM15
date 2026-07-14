/** Coherent demo dataset — the seeded "TechCorp" contract family.
 *
 * Served only when a backend endpoint is unavailable (501/offline), and
 * always labelled as demo data in the UI. The story matches the planted
 * issues in docs/CHALLENGE-4-ANALYSIS.md: an MSA↔SOW payment conflict,
 * an SLA table breaching the liability cap, a "Notwithstanding" override,
 * a 2-clause drafting loop, and a missing Exhibit B.
 */

import type {
  AuditEvent, ChatAnswer, Clause, ContractDocument, CycleReport,
  EvidenceGap, Finding, GraphEdge, GraphNode, ReportSummary,
} from "@/types/api";

export const FAMILY_ID = "fam-techcorp";

export const mockDocuments: ContractDocument[] = [
  {
    id: "doc-msa", family_id: FAMILY_ID, filename: "MSA_TechCorp.pdf",
    title: "Master Services Agreement — TechCorp / Meridian Systems",
    doc_type: "msa", status: "analyzed", uploaded_at: "2026-07-14T09:12:00Z",
  },
  {
    id: "doc-sow", family_id: FAMILY_ID, filename: "SOW_1_Platform_Build.pdf",
    title: "Statement of Work #1 — Platform Build",
    doc_type: "sow", status: "analyzed", uploaded_at: "2026-07-14T09:13:00Z",
  },
];

export const mockClauses: Clause[] = [
  {
    id: "cl-msa-2-4", clause_ref: "MSA-2.4", section_ref: "2.4",
    section_path: ["2 General Provisions", "2.4 Order of Precedence"],
    title: "Order of Precedence",
    text: "2.4 Order of Precedence. In the event of any conflict between this Agreement and any Statement of Work, the terms of this Agreement shall prevail unless the Statement of Work expressly amends this Agreement by reference to the specific Section amended.",
    clause_type: "precedence", page: 4, extraction_confidence: 0.97, evaluability: "evaluable", document_id: "doc-msa",
  },
  {
    id: "cl-msa-5-1", clause_ref: "MSA-5.1", section_ref: "5.1",
    section_path: ["5 Fees and Payment", "5.1 Payment Terms"],
    title: "Payment Terms",
    text: "5.1 Payment Terms. Customer shall pay all undisputed invoices within thirty (30) days of receipt of a correct invoice. Late payments shall accrue interest at 1.5% per month.",
    clause_type: "payment", page: 8, extraction_confidence: 0.98, evaluability: "evaluable", document_id: "doc-msa",
  },
  {
    id: "cl-msa-9-2", clause_ref: "MSA-9.2", section_ref: "9.2",
    section_path: ["9 Limitation of Liability", "9.2 Liability Cap"],
    title: "Liability Cap",
    text: "9.2 Liability Cap. Subject to Section 9.3, each party's aggregate liability arising out of or related to this Agreement shall not exceed the fees paid or payable by Customer in the twelve (12) months preceding the event giving rise to the claim.",
    clause_type: "liability", page: 14, extraction_confidence: 0.96, evaluability: "evaluable", document_id: "doc-msa",
  },
  {
    id: "cl-msa-14-1", clause_ref: "MSA-14.1", section_ref: "14.1",
    section_path: ["14 Indemnification", "14.1 Data Breach Indemnity"],
    title: "Data Breach Indemnity",
    text: "14.1 Data Breach Indemnity. Notwithstanding Section 9.2, Supplier shall indemnify Customer without limitation for losses arising from a breach of Supplier's data protection obligations under Section 10.",
    clause_type: "indemnity", page: 19, extraction_confidence: 0.95, evaluability: "evaluable", document_id: "doc-msa",
  },
  {
    id: "cl-msa-12-3", clause_ref: "MSA-12.3", section_ref: "12.3",
    section_path: ["12 Term and Termination", "12.3 Wind-down Services"],
    title: "Wind-down Services",
    text: "12.3 Wind-down Services. Supplier shall provide wind-down assistance as qualified by Section 8.1, at the rates then in effect.",
    clause_type: "termination", page: 17, extraction_confidence: 0.94, evaluability: "evaluable", document_id: "doc-msa",
  },
  {
    id: "cl-msa-8-1", clause_ref: "MSA-8.1", section_ref: "8.1",
    section_path: ["8 Service Standards", "8.1 Transition Obligations"],
    title: "Transition Obligations",
    text: "8.1 Transition Obligations. Supplier's transition obligations under this Section are subject to Section 12.3 and shall continue for the period stated therein.",
    clause_type: "termination", page: 12, extraction_confidence: 0.94, evaluability: "evaluable", document_id: "doc-msa",
  },
  {
    id: "cl-sow-3-2", clause_ref: "SOW-3.2", section_ref: "3.2",
    section_path: ["3 Commercial Terms", "3.2 Invoicing and Payment"],
    title: "Invoicing and Payment",
    text: "3.2 Invoicing and Payment. Supplier shall invoice on milestone acceptance. Customer shall pay each invoice on Net 60 terms from the invoice date, per the milestone schedule in the table below.",
    clause_type: "payment", page: 4, extraction_confidence: 0.97, evaluability: "evaluable", document_id: "doc-sow",
  },
  {
    id: "cl-sow-7-1", clause_ref: "SOW-7.1", section_ref: "7.1",
    section_path: ["7 Service Levels", "7.1 Service Credits"],
    title: "Service Credits",
    text: "7.1 Service Credits. Service credits shall apply per the SLA table in this Section. Credits are Customer's sole remedy for SLA failures and shall not exceed ten percent (10%) of monthly fees in aggregate.",
    clause_type: "sla", page: 9, extraction_confidence: 0.96, evaluability: "evaluable", document_id: "doc-sow",
  },
  {
    id: "cl-sow-4-4", clause_ref: "SOW-4.4", section_ref: "4.4",
    section_path: ["4 Fees", "4.4 Rates"],
    title: "Rates",
    text: "4.4 Rates. Time-and-materials work shall be billed at the rates set forth in Exhibit B (Rate Card), as amended from time to time.",
    clause_type: "payment", page: 6, extraction_confidence: 0.95, evaluability: "unevaluable", document_id: "doc-sow",
  },
];

export const mockFindings: Finding[] = [
  {
    id: "f-1", category: "contradiction", severity: "critical",
    summary: "Payment terms contradict across documents: MSA requires 30 days, SOW specifies Net 60. MSA prevails per Order of Precedence clause MSA-2.4.",
    playbook_rule: "cross_document.consistency",
    citations: [
      { document: "MSA", clause_ref: "MSA-5.1", page: 8, quote: "Customer shall pay all undisputed invoices within thirty (30) days of receipt of a correct invoice.", verified: true },
      { document: "SOW-1", clause_ref: "SOW-3.2", page: 4, quote: "Customer shall pay each invoice on Net 60 terms from the invoice date", verified: true },
      { document: "MSA", clause_ref: "MSA-2.4", page: 4, quote: "the terms of this Agreement shall prevail", verified: true },
    ],
    redline: {
      ops: [
        { op: "equal", text: "Customer shall pay each invoice on " },
        { op: "delete", text: "Net 60 terms" },
        { op: "insert", text: "Net 30 terms, consistent with Section 5.1 of the MSA," },
        { op: "equal", text: " from the invoice date" },
      ],
      fallback_source: "playbook.payment.fallback_template",
    },
    extraction_confidence: 0.97, grounding_verified: true, status: "open", clause_id: "cl-sow-3-2",
  },
  {
    id: "f-2", category: "sla", severity: "critical",
    summary: "SLA credit table allows up to 25% of monthly fees but the prose caps credits at 10% — the table silently breaches the cap.",
    playbook_rule: "sla.table_vs_prose_consistency",
    citations: [
      { document: "SOW-1", clause_ref: "SOW-7.1", page: 9, quote: "Credits are Customer's sole remedy for SLA failures and shall not exceed ten percent (10%) of monthly fees in aggregate.", verified: true },
      { document: "SOW-1", clause_ref: "table@p9", page: 9, quote: "< 95.0% uptime | 25% of monthly fees", verified: true },
    ],
    redline: null,
    extraction_confidence: 0.96, grounding_verified: true, status: "open", clause_id: "cl-sow-7-1",
  },
  {
    id: "f-3", category: "liability", severity: "high",
    summary: "Liability cap in MSA-9.2 is overridden for data-breach claims: MSA-14.1 begins 'Notwithstanding Section 9.2' and removes the cap entirely for that category.",
    playbook_rule: "liability.effective_cap_analysis",
    citations: [
      { document: "MSA", clause_ref: "MSA-14.1", page: 19, quote: "Notwithstanding Section 9.2, Supplier shall indemnify Customer without limitation", verified: true },
      { document: "MSA", clause_ref: "MSA-9.2", page: 14, quote: "shall not exceed the fees paid or payable by Customer in the twelve (12) months", verified: true },
    ],
    redline: null,
    extraction_confidence: 0.95, grounding_verified: true, status: "open", clause_id: "cl-msa-9-2",
  },
  {
    id: "f-4", category: "termination", severity: "high",
    summary: "Circular reference detected: MSA-12.3 is qualified by MSA-8.1, which is subject to MSA-12.3 — a drafting loop with no resolvable meaning.",
    playbook_rule: "graph.no_circular_references",
    citations: [
      { document: "MSA", clause_ref: "MSA-12.3", page: 17, quote: "as qualified by Section 8.1", verified: true },
      { document: "MSA", clause_ref: "MSA-8.1", page: 12, quote: "subject to Section 12.3 and shall continue for the period stated therein", verified: true },
    ],
    redline: {
      ops: [
        { op: "equal", text: "Supplier's transition obligations under this Section " },
        { op: "delete", text: "are subject to Section 12.3 and " },
        { op: "insert", text: "shall continue for ninety (90) days following termination and " },
        { op: "equal", text: "shall continue for the period stated therein." },
      ],
      fallback_source: "playbook.termination.fallback_template",
    },
    extraction_confidence: 0.94, grounding_verified: true, status: "open", clause_id: "cl-msa-12-3",
  },
  {
    id: "f-5", category: "payment", severity: "medium",
    summary: "SOW payment terms of 60 days exceed the playbook maximum of 45 days.",
    playbook_rule: "payment.max_payment_days=45",
    citations: [
      { document: "SOW-1", clause_ref: "SOW-3.2", page: 4, quote: "Customer shall pay each invoice on Net 60 terms from the invoice date", verified: true },
    ],
    redline: null,
    extraction_confidence: 0.97, grounding_verified: true, status: "accepted", clause_id: "cl-sow-3-2",
  },
];

export const mockGaps: EvidenceGap[] = [
  {
    missing_document: "Exhibit B",
    referenced_from: ["SOW-4.4"],
    blocked_clause_refs: ["SOW-4.4", "SOW-3.2", "SOW-7.1"],
    resolved: false,
  },
];

export const mockGraph: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: mockClauses.map((c) => ({
    id: c.id, clause_ref: c.clause_ref, clause_type: c.clause_type, document_id: c.document_id,
  })),
  edges: [
    { source: "cl-msa-14-1", target: "cl-msa-9-2", edge_type: "OVERRIDES", trigger_text: "Notwithstanding Section 9.2" },
    { source: "cl-msa-12-3", target: "cl-msa-8-1", edge_type: "REFERENCES", trigger_text: "as qualified by Section 8.1" },
    { source: "cl-msa-8-1", target: "cl-msa-12-3", edge_type: "SUBORDINATE_TO", trigger_text: "subject to Section 12.3" },
    { source: "cl-sow-3-2", target: "cl-msa-5-1", edge_type: "CONTRADICTS", trigger_text: "Net 60 vs thirty (30) days" },
    { source: "cl-msa-2-4", target: "cl-sow-3-2", edge_type: "REFERENCES", trigger_text: "conflict between this Agreement and any Statement of Work" },
    { source: "cl-sow-7-1", target: "cl-msa-9-2", edge_type: "SUBORDINATE_TO", trigger_text: "credit cap vs liability cap" },
    { source: "cl-sow-4-4", target: "cl-sow-3-2", edge_type: "REFERENCES", trigger_text: "billed at the rates" },
  ],
};

export const mockCycles: CycleReport[] = [
  {
    clauses: ["MSA-12.3", "MSA-8.1"],
    edges: [
      { source: "MSA-12.3", target: "MSA-8.1", edge_type: "REFERENCES", trigger_text: "as qualified by Section 8.1" },
      { source: "MSA-8.1", target: "MSA-12.3", edge_type: "SUBORDINATE_TO", trigger_text: "subject to Section 12.3" },
    ],
    suggested_break: { source: "MSA-12.3", target: "MSA-8.1", edge_type: "REFERENCES", trigger_text: "as qualified by Section 8.1" },
  },
];

export const mockReport: ReportSummary = {
  contract_family_id: FAMILY_ID,
  generated_at: "2026-07-14T10:02:00Z",
  findings_total: 5,
  findings_by_severity: { critical: 2, high: 2, medium: 1, low: 0 },
  claims_generated: 142,
  claims_verified: 139,
  claims_rejected: 3,
};

export const mockAudit: AuditEvent[] = [
  { id: "a-1", family_id: FAMILY_ID, event_type: "document.uploaded", payload: { filename: "MSA_TechCorp.pdf" }, prev_hash: "0".repeat(64), event_hash: "8f2a…c41d", created_at: "2026-07-14T09:12:00Z" },
  { id: "a-2", family_id: FAMILY_ID, event_type: "document.uploaded", payload: { filename: "SOW_1_Platform_Build.pdf" }, prev_hash: "8f2a…c41d", event_hash: "b7e9…0a52", created_at: "2026-07-14T09:13:00Z" },
  { id: "a-3", family_id: FAMILY_ID, event_type: "gate.evidence_gap", payload: { missing: "Exhibit B", blocked: 3 }, prev_hash: "b7e9…0a52", event_hash: "4c1f…9e77", created_at: "2026-07-14T09:14:10Z" },
  { id: "a-4", family_id: FAMILY_ID, event_type: "analysis.completed", payload: { findings: 5, verified: 139, rejected: 3 }, prev_hash: "4c1f…9e77", event_hash: "d05a…31bb", created_at: "2026-07-14T09:16:45Z" },
  { id: "a-5", family_id: FAMILY_ID, event_type: "review.accepted", payload: { finding: "f-5", reviewer: "priya@lexguard.ai" }, prev_hash: "d05a…31bb", event_hash: "77e3…8c09", created_at: "2026-07-14T09:41:22Z" },
];

export function mockChatAnswer(question: string): ChatAnswer {
  const q = question.toLowerCase();
  if (q.includes("rate") || q.includes("fee") || q.includes("exhibit")) {
    return {
      answer: "I can't evaluate the rates — SOW-4.4 incorporates Exhibit B (Rate Card), which has not been uploaded. Rather than guess, I've listed exactly what's blocked. Upload Exhibit B to unlock fee analysis.",
      claims: [{ summary: "Rates depend on a missing document", quote: "billed at the rates set forth in Exhibit B (Rate Card)", clause_ref: "SOW-4.4", verified: true }],
      refused: true,
      refusal_reason: "Missing external document: Exhibit B (blocks SOW-4.4, SOW-3.2, SOW-7.1)",
    };
  }
  if (q.includes("liab") || q.includes("cap")) {
    return {
      answer: "The liability cap is 12 months of fees (MSA-9.2) — but it is NOT airtight: MSA-14.1 overrides it for data-breach claims via 'Notwithstanding Section 9.2', making that category uncapped.",
      claims: [
        { summary: "Base cap is 12 months of fees", quote: "shall not exceed the fees paid or payable by Customer in the twelve (12) months", clause_ref: "MSA-9.2", verified: true },
        { summary: "Data-breach carve-out is uncapped", quote: "Notwithstanding Section 9.2, Supplier shall indemnify Customer without limitation", clause_ref: "MSA-14.1", verified: true },
      ],
    };
  }
  if (q.includes("pay")) {
    return {
      answer: "Payment terms conflict: the MSA requires payment within 30 days (MSA-5.1) while SOW-1 specifies Net 60 (SOW-3.2). Per the Order of Precedence clause (MSA-2.4), the MSA prevails — the SOW term is unenforceable as drafted.",
      claims: [
        { summary: "MSA requires 30 days", quote: "within thirty (30) days of receipt of a correct invoice", clause_ref: "MSA-5.1", verified: true },
        { summary: "SOW specifies Net 60", quote: "Customer shall pay each invoice on Net 60 terms", clause_ref: "SOW-3.2", verified: true },
      ],
    };
  }
  return {
    answer: "Here's what the verified clauses say. Ask about payment terms, the liability cap, service credits, or the rates in Exhibit B for a grounded walkthrough with citations.",
    claims: [{ summary: "Order of precedence governs conflicts", quote: "the terms of this Agreement shall prevail", clause_ref: "MSA-2.4", verified: true }],
  };
}
