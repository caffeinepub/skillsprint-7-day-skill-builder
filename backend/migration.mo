import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type DayPlan = {
    objectives : Text;
    actionTask : Text;
    practiceExercise : Text;
    deliverable : Text;
    estimatedTime : Nat;
  };

  type BonusResource = {
    title : Text;
    url : Text;
  };

  type SprintPlan = {
    planId : Nat;
    skillName : Text;
    hoursPerDay : Nat;
    skillLevel : Text;
    desiredOutcome : Text;
    skillOverview : Text;
    days : [DayPlan];
    endOfWeekResult : Text;
    commonMistakes : [Text];
    bonusResource : BonusResource;
    unlockedStatus : Bool;
  };

  type OldActor = {
    plans : Map.Map<Nat, SprintPlan>;
    paymentRecords : Map.Map<Nat, Text>;
    nextPlanId : Nat;
  };

  type NewActor = {
    plans : Map.Map<Nat, SprintPlan>;
    paymentRecords : Map.Map<Nat, Text>;
    nextPlanId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    { old with nextPlanId = old.nextPlanId + 1 };
  };
};
