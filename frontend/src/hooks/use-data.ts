"use client";

/** TanStack Query hooks — components never call fetch directly. */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as services from "@/services";
import type { FindingStatus } from "@/types/api";

export const useDocuments = () =>
  useQuery({ queryKey: ["documents"], queryFn: services.getDocuments });

export const useClauses = () =>
  useQuery({ queryKey: ["clauses"], queryFn: () => services.getClauses() });

export const useEvidenceGaps = () =>
  useQuery({ queryKey: ["gaps"], queryFn: () => services.getEvidenceGaps() });

export const useGraph = () =>
  useQuery({ queryKey: ["graph"], queryFn: () => services.getGraph() });

export const useCycles = () =>
  useQuery({ queryKey: ["cycles"], queryFn: () => services.getCycles() });

export const useFindings = () =>
  useQuery({ queryKey: ["findings"], queryFn: () => services.getFindings() });

export const useReportSummary = () =>
  useQuery({ queryKey: ["report"], queryFn: () => services.getReportSummary() });

export const useAuditTrail = () =>
  useQuery({ queryKey: ["audit"], queryFn: () => services.getAuditTrail() });

export function useReviewFinding() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: FindingStatus; reason?: string }) =>
      services.reviewFinding(id, action, reason),
    onSuccess: () => client.invalidateQueries({ queryKey: ["findings"] }),
  });
}
