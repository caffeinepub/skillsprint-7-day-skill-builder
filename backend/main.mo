import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

import MixinStorage "blob-storage/Mixin";
import Migration "migration";

// Apply migration on upgrade!
(with migration = Migration.run)
actor {
  include MixinStorage();

  type Resource = {
    title : Text;
    url : Text;
    description : Text;
  };

  type DayPlan = {
    objectives : Text;
    actionTask : Text;
    practiceExercise : Text;
    deliverable : Text;
    estimatedTime : Nat;
    resources : [Resource];
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

  func getResourcesForDay(skill : Text, level : Text, day : Nat) : [Resource] {
    switch (skill, level, day) {
      // Public Speaking
      case ("public speaking", "beginner", 0) {
        [
          {
            title = "Intro to Public Speaking";
            url = "https://www.youtube.com/results?search_query=intro+to+public+speaking";
            description = "YouTube curated introduction playlist.";
          },
          {
            title = "Overcoming Stage Fright";
            url = "https://www.mindtools.com/a5ka4l1/overcoming-stage-fright";
            description = "MindTools article on confidence building.";
          },
        ];
      };
      case ("public speaking", "intermediate", 0) {
        [
          {
            title = "Effective Communication";
            url = "https://www.coursera.org/learn/wharton-communication-skills";
            description = "Coursera course preview on communication strategies.";
          },
        ];
      };
      case ("public speaking", "advanced", 0) {
        [
          {
            title = "Advanced Presentation Techniques";
            url = "https://hbr.org/2019/04/how-to-give-a-killer-presentation";
            description = "Harvard Business Review article on advanced public speaking.";
          },
        ];
      };
      case ("public speaking", _, 1) {
        [
          {
            title = "Structure a Speech";
            url = "https://examples.yourdictionary.com/examples-of-speech";
            description = "Examples and templates for structuring speeches.";
          },
        ];
      };
      // Python
      case ("python", "beginner", 0) {
        [
          {
            title = "Python Official Tutorials";
            url = "https://docs.python.org/3/tutorial/index.html";
            description = "Guided fundamentals by Python Software Foundation.";
          },
          {
            title = "Beginner Python Exercises";
            url = "https://exercism.org/tracks/python/exercises";
            description = "Free coding challenges on Exercism.";
          },
        ];
      };
      case ("python", "intermediate", 3) {
        [
          {
            title = "Python Project Templates";
            url = "https://realpython.com/tutorials/projects/";
            description = "RealPython project guides.";
          },
          {
            title = "Automate the Boring Stuff";
            url = "https://automatetheboringstuff.com/";
            description = "Automation projects using Python.";
          },
        ];
      };
      // Excel
      case ("excel", _, 0) {
        [
          {
            title = "Excel Basics";
            url = "https://exceljet.net/tutorial";
            description = "Step-by-step guides on Excel fundamentals.";
          },
        ];
      };
      // UI Design
      case ("ui design", _, 0) {
        [
          {
            title = "UI Design Principles";
            url = "https://developer.mozilla.org/en-US/docs/Learn/Forms";
            description = "MDN Web Docs on UI design forms.";
          },
        ];
      };
      // Photography
      case ("photography", _, 0) {
        [
          {
            title = "Beginner Photography Guide";
            url = "https://www.photographytalk.com/learn-photography";
            description = "Photography Talk articles for beginners.";
          },
        ];
      };
      // Writing
      case ("writing", _, 0) {
        [
          {
            title = "Creative Writing Basics";
            url = "https://www.freecodecamp.org/news/category/writing/";
            description = "freeCodeCamp resources on writing.";
          },
        ];
      };
      // Generic fallback for custom skills
      case (_, _, 0) {
        [
          {
            title = "Getting Started Guide";
            url = "https://www.codecademy.com/learn";
            description = "Codecademy resources for various skills.";
          },
        ];
      };
      // FINAL SWITCH CASE for case not handled
      case (_) { [] };
    };
  };

  func generateDayPlan(skillName : Text, level : Text, hours : Nat, dayIndex : Nat) : DayPlan {
    {
      objectives = "Objectives for day " # dayIndex.toText();
      actionTask = "Complete tasks for day " # dayIndex.toText();
      practiceExercise = "Practice exercises for day " # dayIndex.toText();
      deliverable = "Submit deliverables for day " # dayIndex.toText();
      estimatedTime = hours + 1;
      resources = getResourcesForDay(skillName, level, dayIndex);
    };
  };

  func generateAllDays(skillName : Text, hoursPerDay : Nat, level : Text, _outcome : Text) : [DayPlan] {
    Array.tabulate<DayPlan>(
      7,
      func(dayIndex) {
        generateDayPlan(skillName, level, hoursPerDay, dayIndex);
      },
    );
  };

  func generatePlan(skillName : Text, hoursPerDay : Nat, level : Text, outcome : Text) : SprintPlan {
    let days = generateAllDays(skillName, hoursPerDay, level, outcome);
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
        "Poor maintenance of best practices",
        "Ignoring performance optimization",
        "Lack of thorough reviews",
        "Inadequate documentation",
      ];
      bonusResource = {
        title = "Advanced Resources in " # skillName # " Techniques";
        url = "http://advanced-resources.example.com";
      };
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
