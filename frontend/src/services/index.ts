/** Services layer — the ONLY place the app talks to the backend.
 *
 * Every read tries the real endpoint first and falls back to the demo
 * dataset on 501/offline, returning {data, demo} so the UI labels
 * demo-served content honestly.
 */

import { api, withFallback } from "@/lib/api-client";
import type {
  AuditEvent, ChatAnswer, Clause, ContractDocument, CycleReport,
  EvidenceGap, Finding, FindingStatus, GraphEdge, GraphNode, ReportSummary,
} from "@/types/api";
import {
  FAMILY_ID, mockAudit, mockChatAnswer, mockClauses, mockCycles,
  mockDocuments, mockFindings, mockGaps, mockGraph, mockReport,
} from "./mocks";

export { FAMILY_ID };

// ── Auth ────────────────────────────────────────────────────
export async function login(email: string, password: string) {
  try {
    const result = await api.post<{ access_token: string }>("/auth/login", { email, password });
    return { token: result.access_token, demo: false };
  } catch {
    // Backend auth not wired yet — demo session, clearly labelled.
    return { token: "demo-token", demo: true };
  }
}

// ── Upload (real endpoint) ──────────────────────────────────
export async function uploadDocument(file: File, docType: string) {
  const form = new FormData();
  form.append("file", file);
  return api.post<{ document_path: string; job: { job_id: string; status: string } }>(
    `/upload?doc_type=${encodeURIComponent(docType)}`,
    form,
  );
}

// ── Contracts ───────────────────────────────────────────────
export const getDocuments = () =>
  withFallback(() => api.get<ContractDocument[]>("/contracts"), mockDocuments);

export const getClauses = (familyId: string = FAMILY_ID) =>
  withFallback(() => api.get<Clause[]>(`/contracts/${familyId}/clauses`), mockClauses);

export const getEvidenceGaps = (familyId: string = FAMILY_ID) =>
  withFallback(() => api.get<EvidenceGap[]>(`/contracts/${familyId}/gaps`), mockGaps);

// ── Graph ───────────────────────────────────────────────────
export const getGraph = (familyId: string = FAMILY_ID) =>
  withFallback(
    () => api.get<{ nodes: GraphNode[]; edges: GraphEdge[] }>(`/graph/${familyId}`),
    mockGraph,
  );

export const getCycles = (familyId: string = FAMILY_ID) =>
  withFallback(() => api.get<CycleReport[]>(`/graph/${familyId}/cycles`), mockCycles);

// ── Risk ────────────────────────────────────────────────────
export const getFindings = (familyId: string = FAMILY_ID) =>
  withFallback(() => api.get<Finding[]>(`/risk/${familyId}/findings`), mockFindings);

export async function reviewFinding(findingId: string, action: FindingStatus, reason?: string) {
  try {
    await api.post(`/risk/findings/${findingId}/review`, { action, reason });
    return { demo: false };
  } catch {
    return { demo: true }; // optimistic local update; backend review pending
  }
}

export const runAnalysis = (familyId: string = FAMILY_ID) =>
  withFallback(() => api.post<{ job_id: string }>(`/risk/${familyId}/analyze`), { job_id: "demo-job" });

// ── Chat ────────────────────────────────────────────────────
export async function askCopilot(question: string, familyId: string = FAMILY_ID) {
  const result = await withFallback(
    () => api.post<ChatAnswer>("/chat", { contract_id: familyId, question }),
    mockChatAnswer(question),
  );
  return result;
}

// ── Reports / audit ─────────────────────────────────────────
export const getReportSummary = (familyId: string = FAMILY_ID) =>
  withFallback(() => api.get<ReportSummary>(`/reports/${familyId}/json`), mockReport);

export const getAuditTrail = (familyId: string = FAMILY_ID) =>
  withFallback(() => api.get<AuditEvent[]>(`/reports/${familyId}/audit`), mockAudit);

// ── Health ──────────────────────────────────────────────────
export async function backendOnline(): Promise<boolean> {
  try {
    await api.get("/health");
    return true;
  } catch {
    return false;
  }
}
