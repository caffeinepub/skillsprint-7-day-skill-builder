import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useNavigate } from "@tanstack/react-router";

export function useCreatePlan() {
  const { actor } = useActor();
  const navigate = useNavigate();
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
      if (!actor) throw new Error("Backend not ready. Please try again.");
      const planId = await actor.createPlan(
        skillName,
        BigInt(hoursPerDay),
        level,
        outcome
      );
      return planId;
    },
    onSuccess: (planId: bigint) => {
      queryClient.invalidateQueries({ queryKey: ["plan", planId.toString()] });
      navigate({ to: "/plan/$planId", params: { planId: planId.toString() } });
    },
    onError: (error: unknown) => {
      // Error is handled in the component
      console.error("Plan creation failed:", error);
    },
  });
}

export function useGetPlan(planId: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["plan", planId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getPlan(BigInt(planId));
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!planId,
  });
}

export function useGetPublicPlanView(planId: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["publicPlan", planId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getPublicPlanView(BigInt(planId));
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!planId,
  });
}
