import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SprintPlan {
    endOfWeekResult: string;
    unlockedStatus: boolean;
    bonusResource: BonusResource;
    planId: bigint;
    days: Array<DayPlan>;
    skillName: string;
    commonMistakes: Array<string>;
    hoursPerDay: bigint;
    skillLevel: string;
    desiredOutcome: string;
    skillOverview: string;
}
export interface DayPlan {
    deliverable: string;
    actionTask: string;
    practiceExercise: string;
    estimatedTime: bigint;
    objectives: string;
}
export interface BonusResource {
    url: string;
    title: string;
}
export interface PublicPlanView {
    endOfWeekResult: string;
    bonusResource: BonusResource;
    planId: bigint;
    skillName: string;
    commonMistakes: Array<string>;
    hoursPerDay: bigint;
    skillLevel: string;
    desiredOutcome: string;
    skillOverview: string;
    firstDay: DayPlan;
}
export interface backendInterface {
    createPlan(skillName: string, hoursPerDay: bigint, level: string, outcome: string): Promise<bigint>;
    getPlan(planId: bigint): Promise<SprintPlan | null>;
    getPublicPlanView(planId: bigint): Promise<PublicPlanView | null>;
    isPlanUnlocked(planId: bigint): Promise<boolean>;
    submitTransactionId(planId: bigint, transactionId: string): Promise<void>;
}
