import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";

module {
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

  type DayPlan = {
    objectives : Text;
    actionTask : Text;
    practiceExercise : Text;
    deliverable : Text;
    estimatedTime : Nat;
  };

  type OldActor = {
    plans : Map.Map<Nat, SprintPlan>;
    nextPlanId : Nat;
    paymentRecords : Map.Map<Nat, Text>;
  };

  type NewActor = {
    plans : Map.Map<Nat, SprintPlan>;
    nextPlanId : Nat;
    paymentRecords : Map.Map<Nat, Text>;
  };

  func getValidBonusResource(skillName : Text) : BonusResource {
    switch (skillName.toLower()) {
      case ("javascript") {
        {
          title = "MDN JavaScript Guide (Official)";
          url = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide";
        };
      };
      case ("python") {
        {
          title = "Python Official Documentation";
          url = "https://docs.python.org/3/tutorial/";
        };
      };
      case ("html") {
        {
          title = "MDN HTML Guide (Official)";
          url = "https://developer.mozilla.org/en-US/docs/Web/HTML";
        };
      };
      case ("css") {
        {
          title = "MDN CSS Guide (Official)";
          url = "https://developer.mozilla.org/en-US/docs/Web/CSS";
        };
      };
      case ("java") {
        {
          title = "Java Documentation (Oracle)";
          url = "https://docs.oracle.com/en/java/";
        };
      };
      case ("react") {
        {
          title = "React Official Documentation";
          url = "https://react.dev/";
        };
      };
      case ("git") {
        {
          title = "Git Official Documentation";
          url = "https://git-scm.com/doc";
        };
      };
      case ("rust") {
        {
          title = "Rust Official Documentation";
          url = "https://doc.rust-lang.org/book/";
        };
      };
      case ("typescript") {
        {
          title = "Typescript Official Documentation";
          url = "https://www.typescriptlang.org/docs/";
        };
      };
      case ("motoko") {
        {
          title = "Motoko Official Documentation";
          url = "https://internetcomputer.org/docs/current/developer-docs/backend/motoko/guide";
        };
      };
      case (_) {
        {
          title = "Wikipedia Search for " # skillName;
          url = "https://en.wikipedia.org/wiki/" # skillName # "_programming_language";
        };
      };
    };
  };

  public func run(old : OldActor) : NewActor {
    let newPlans = old.plans.map<Nat, SprintPlan, SprintPlan>(
      func(_id, plan) {
        { plan with bonusResource = getValidBonusResource(plan.skillName) };
      }
    );
    { old with plans = newPlans };
  };
};
