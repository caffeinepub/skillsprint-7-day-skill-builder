import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SprintPlan, PublicPlanView } from '../backend';

function extractErrorMessage(err: unknown): string {
  if (!err) return 'An unknown error occurred.';
  if (typeof err === 'string') return err;
  if (err instanceof Error) {
    const msg = err.message;

    // IC/Motoko rejection errors — try multiple known patterns
    // Pattern: "Reject text: <message>"
    const rejectMatch = msg.match(/Reject text:\s*(.+?)(?:\n|$)/i);
    if (rejectMatch) return rejectMatch[1].trim();

    // Pattern: "Error from Canister ...: <message>"
    const canisterMatch = msg.match(/Error from Canister[^:]*:\s*(.+?)(?:\n|$)/i);
    if (canisterMatch) return canisterMatch[1].trim();

    // Pattern: "trapped explicitly: <message>"
    const trapMatch = msg.match(/trapped explicitly:\s*(.+?)(?:\n|$)/i);
    if (trapMatch) return trapMatch[1].trim();

    // Pattern: "Call failed ...: <message>" (generic IC call failure)
    const callFailedMatch = msg.match(/Call failed[^:]*:\s*(.+?)(?:\n|$)/i);
    if (callFailedMatch) return callFailedMatch[1].trim();

    // Pattern: "IC0503" or similar IC error codes followed by message
    const icCodeMatch = msg.match(/IC\d+[^:]*:\s*(.+?)(?:\n|$)/i);
    if (icCodeMatch) return icCodeMatch[1].trim();

    return msg;
  }
  if (typeof err === 'object' && err !== null) {
    const obj = err as Record<string, unknown>;
    if (typeof obj['message'] === 'string') return obj['message'];
    if (typeof obj['reject_message'] === 'string') return obj['reject_message'];
  }
  return String(err);
}

export function useCreatePlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      skillName,
      hoursPerDay,
      level,
      outcome,
    }: {
      skillName: string;
      hoursPerDay: number;
      level: string;
      outcome: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized. Please wait a moment and try again.');
      let planId: bigint;
      try {
        planId = await actor.createPlan(skillName, BigInt(hoursPerDay), level, outcome);
      } catch (err) {
        const message = extractErrorMessage(err);
        // Provide a user-friendly fallback if the raw message is too technical
        const userMessage =
          message && message.length > 0 && message.length < 300
            ? message
            : 'Plan generation failed. Please try again.';
        throw new Error(userMessage);
      }
      if (planId === undefined || planId === null) {
        throw new Error('Plan creation failed: no plan ID returned from the server.');
      }
      return planId;
    },
    onSuccess: (planId) => {
      queryClient.invalidateQueries({ queryKey: ['plan', planId.toString()] });
    },
  });
}

export function useGetPlan(planId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<SprintPlan | null>({
    queryKey: ['plan', planId],
    queryFn: async () => {
      if (!actor || !planId) return null;
      const result = await actor.getPlan(BigInt(planId));
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!planId,
    staleTime: 0,
  });
}

export function useGetPublicPlanView(planId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<PublicPlanView | null>({
    queryKey: ['publicPlan', planId],
    queryFn: async () => {
      if (!actor || !planId) return null;
      const result = await actor.getPublicPlanView(BigInt(planId));
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!planId,
    staleTime: 0,
  });
}
