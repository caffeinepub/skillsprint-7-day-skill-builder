import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

module {
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

  func getResourcesForDay(skill : Text, level : Text, day : Nat) : [Resource] {
    switch (skill, level, day) {
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
      case ("public speaking", "beginner", 1) {
        [
          {
            title = "Speech Structure Basics";
            url = "https://www.toastmasters.org/find-a-club";
            description = "Toastmasters guide to speech outlining.";
          },
        ];
      };
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
      case (_) { [] };
    };
  };

  func updateDayPlan(day : DayPlan, skillName : Text, level : Text, dayIndex : Nat) : DayPlan {
    { day with resources = getResourcesForDay(skillName, level, dayIndex) };
  };

  func updateSprintPlan(plan : SprintPlan) : SprintPlan {
    if (plan.days.size() != 7) { return plan };
    let newDays = Array.tabulate(
      7,
      func(dayIndex) {
        updateDayPlan(plan.days[dayIndex], plan.skillName, plan.skillLevel, dayIndex);
      },
    );
    { plan with days = newDays };
  };

  public func run(old : OldActor) : NewActor {
    let newPlans = old.plans.map<Nat, SprintPlan, SprintPlan>(
      func(_id, plan) {
        updateSprintPlan(plan);
      }
    );
    { old with plans = newPlans };
  };
};
