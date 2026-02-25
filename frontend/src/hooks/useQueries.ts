import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SprintPlan, PublicPlanView } from '../backend';

function extractErrorMessage(err: unknown): string {
  if (!err) return 'An unknown error occurred.';
  if (typeof err === 'string') return err;
  if (err instanceof Error) {
    const msg = err.message;
    // IC/Motoko rejection errors often contain the trap message after "Reject text:"
    const rejectMatch = msg.match(/Reject text:\s*(.+?)(?:\n|$)/i);
    if (rejectMatch) return rejectMatch[1].trim();
    // Also check for "Error from Canister" pattern
    const canisterMatch = msg.match(/Error from Canister[^:]*:\s*(.+?)(?:\n|$)/i);
    if (canisterMatch) return canisterMatch[1].trim();
    return msg;
  }
  if (typeof err === 'object' && err !== null) {
    const obj = err as Record<string, unknown>;
    if (typeof obj['message'] === 'string') return obj['message'];
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
        throw new Error(message);
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

export function useIsPlanUnlocked(planId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['planUnlocked', planId],
    queryFn: async () => {
      if (!actor || !planId) return false;
      return actor.isPlanUnlocked(BigInt(planId));
    },
    enabled: !!actor && !isFetching && !!planId,
    staleTime: 0,
  });
}

export function useSubmitTransactionId() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      transactionId,
    }: {
      planId: string;
      transactionId: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.submitTransactionId(BigInt(planId), transactionId);
    },
    onSuccess: (_, { planId }) => {
      queryClient.invalidateQueries({ queryKey: ['plan', planId] });
      queryClient.invalidateQueries({ queryKey: ['publicPlan', planId] });
      queryClient.invalidateQueries({ queryKey: ['planUnlocked', planId] });
    },
  });
}
