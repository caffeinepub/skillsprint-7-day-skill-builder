import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

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

  type PublicPlanView = {
    planId : Nat;
    skillName : Text;
    hoursPerDay : Nat;
    skillLevel : Text;
    desiredOutcome : Text;
    skillOverview : Text;
    firstDay : DayPlan;
    endOfWeekResult : Text;
    commonMistakes : [Text];
    bonusResource : BonusResource;
  };

  let plans = Map.empty<Nat, SprintPlan>();
  let paymentRecords = Map.empty<Nat, Text>();

  var nextPlanId = 1;

  func generateDayPlan(skillName : Text, level : Text, hours : Nat, dayIndex : Nat, outcome : Text) : DayPlan {
    switch (dayIndex) {
      case (1) {
        {
          objectives = "Understand the fundamentals of " # skillName # " at a " # level # " level.";
          actionTask = "Familiarize yourself with core terminologies and basic features of " # skillName # ".";
          practiceExercise = "Complete 'Getting Started' exercises using online resources.";
          deliverable = "Summarize findings in a document and submit setup screenshot.";
          estimatedTime = hours;
        };
      };
      case (2) {
        {
          objectives = "Dive deeper into the first core concept of " # skillName # ".";
          actionTask = "Study the underlying principles and applications of core concept A.";
          practiceExercise = "Write code samples or exercises demonstrating concept A.";
          deliverable = "Submit annotated examples showcasing understanding.";
          estimatedTime = hours + 1;
        };
      };
      case (3) {
        {
          objectives = "Study the second major building block of " # skillName # ".";
          actionTask = "Explore documentation and tutorials on core concept B.";
          practiceExercise = "Complete practical exercises for concept B.";
          deliverable = "Submit a comparison of concepts A and B with code snippets.";
          estimatedTime = hours + 1;
        };
      };
      case (4) {
        {
          objectives = "Integrate core concepts through hands-on tasks.";
          actionTask = "Work on a project combining concepts A and B.";
          practiceExercise = "Reproduce real-world examples using both concepts.";
          deliverable = "Submit project preview and explanation.";
          estimatedTime = hours + 2;
        };
      };
      case (5) {
        {
          objectives = "Advance skills with intermediate techniques in " # skillName # ".";
          actionTask = "Study advanced tutorials and case studies.";
          practiceExercise = "Apply new skills to projects.";
          deliverable = "Submit presentation of progress and challenges.";
          estimatedTime = hours + 2;
        };
      };
      case (6) {
        {
          objectives = "Consolidate skills with a final project.";
          actionTask = "Review all content and fill knowledge gaps.";
          practiceExercise = "Document final project and challenges.";
          deliverable = "Submit completed project and report.";
          estimatedTime = hours + 3;
        };
      };
      case (7) {
        {
          objectives = "Demonstrate accomplishment of the final outcome.";
          actionTask = "Prepare for project submission.";
          practiceExercise = "Refine results to meet standards.";
          deliverable = "Submit final project demonstrating mastery.";
          estimatedTime = hours;
        };
      };
      case (_) {
        Runtime.trap("Invalid dayIndex: " # dayIndex.toText());
      };
    };
  };

  func generateAlignedDayPlan(skillName : Text, hoursPerDay : Nat, level : Text, outcome : Text, dayIndex : Nat) : DayPlan {
    generateDayPlan(skillName, level, hoursPerDay, dayIndex + 1, outcome);
  };

  func generateAllDays(skillName : Text, hoursPerDay : Nat, level : Text, outcome : Text) : [DayPlan] {
    Array.tabulate<DayPlan>(
      7,
      func(dayIndex) {
        generateAlignedDayPlan(skillName, hoursPerDay, level, outcome, dayIndex);
      },
    );
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

  func generatePlan(skillName : Text, hoursPerDay : Nat, level : Text, outcome : Text) : SprintPlan {
    let days = generateAllDays(skillName, hoursPerDay, level, outcome);
    let bonusResource = getValidBonusResource(skillName);
    {
      planId = nextPlanId;
      skillName;
      hoursPerDay;
      skillLevel = level;
      desiredOutcome = outcome;
      skillOverview = "Detailed overview for " # skillName # ".";
      days;
      endOfWeekResult = "Definitive result for " # skillName # ".";
      commonMistakes = [
        "Neglecting core concepts",
        "Poor practices maintenance",
        "Ignoring optimization",
        "Lack of reviews",
        "Inadequate documentation",
      ];
      bonusResource = bonusResource;
      unlockedStatus = false;
    };
  };

  public shared ({ caller }) func createPlan(skillName : Text, hoursPerDay : Nat, level : Text, outcome : Text) : async Nat {
    let plan = generatePlan(skillName, hoursPerDay, level, outcome);
    plans.add(nextPlanId, plan);
    nextPlanId += 1;
    plan.planId;
  };

  public shared ({ caller }) func submitTransactionId(planId : Nat, transactionId : Text) : async () {
    if (transactionId.size() == 0) { Runtime.trap("Transaction ID cannot be empty") };
    switch (plans.get(planId)) {
      case (null) { Runtime.trap("Invalid Plan ID. Please try again.") };
      case (?plan) {
        paymentRecords.add(planId, transactionId);
        plans.add(
          planId,
          {
            plan with
            unlockedStatus = true;
          },
        );
      };
    };
  };

  public query ({ caller }) func getPlan(planId : Nat) : async ?SprintPlan {
    plans.get(planId);
  };

  public query ({ caller }) func getPublicPlanView(planId : Nat) : async ?PublicPlanView {
    switch (plans.get(planId)) {
      case (null) { null };
      case (?plan) {
        ?{
          planId = plan.planId;
          skillName = plan.skillName;
          hoursPerDay = plan.hoursPerDay;
          skillLevel = plan.skillLevel;
          desiredOutcome = plan.desiredOutcome;
          skillOverview = plan.skillOverview;
          firstDay = plan.days[0];
          endOfWeekResult = plan.endOfWeekResult;
          commonMistakes = plan.commonMistakes;
          bonusResource = plan.bonusResource;
        };
      };
    };
  };

  public query ({ caller }) func isPlanUnlocked(planId : Nat) : async Bool {
    switch (plans.get(planId)) {
      case (null) { false };
      case (?plan) { plan.unlockedStatus };
    };
  };
};
