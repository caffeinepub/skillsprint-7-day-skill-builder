import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
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

  func generateStartDay(skillName : Text, level : Text, hours : Nat) : DayPlan {
    {
      objectives = "Master the fundamentals of " # skillName # ". Begin by understanding the core components and their practical applications.";
      actionTask = "Setup your development environment and complete a simple project that demonstrates the basics of " # skillName # ".";
      practiceExercise = "Identify real-world examples where " # skillName # " is used. Analyze its architecture and deconstruct its core functionality.";
      deliverable = "Submit a detailed technical document that outlines your understanding of " # skillName # " basics, including key terminologies and essential components.";
      estimatedTime = hours + 1;
    };
  };

  func generateOtherDay(skillName : Text, level : Text, hours : Nat, dayNum : Nat, dayType : Text, objectives : Text, actionTask : Text, practiceExercise : Text, deliverable : Text, estimatedTime : Nat) : DayPlan {
    {
      objectives;
      actionTask;
      practiceExercise;
      deliverable;
      estimatedTime;
    };
  };

  func generateAllDays(skillName : Text, hoursPerDay : Nat, level : Text, outcome : Text) : [DayPlan] {
    [
      generateStartDay(skillName, level, hoursPerDay),
      generateOtherDay(
        skillName,
        level,
        hoursPerDay,
        2,
        "Intermediate",
        "Deepen your understanding of " # skillName # " and its application in managing complex data and system integration.",
        "Explore core components associated with " # skillName # " and integrate them into a small application. Demonstrate advanced usage scenarios.",
        "Complete hands-on tasks that involve complex data manipulation and integration using " # skillName # ".",
        "Submit a technical report that details advanced usage, demonstrates complex integration, and outlines best practices in " # skillName # ".",
        hoursPerDay + 2,
      ),
      generateOtherDay(
        skillName,
        level,
        hoursPerDay,
        3,
        "Intermediate",
        "Learn advanced application of " # skillName # " in real-world scenarios. Focus on optimization and scalability.",
        "Implement best practices for data management and system performance using " # skillName # ".",
        "Refactor an existing application to optimize performance and achieve scalability. ",
        "Deliver a performance report and demonstrate tangible improvements in data management efficiency and system scalability.",
        hoursPerDay + 1,
      ),
      generateOtherDay(
        skillName,
        level,
        hoursPerDay,
        4,
        "Advanced",
        "Explore advanced design patterns and software architecture using " # skillName # ".",
        "Research and implement complex architectural designs that optimize system performance and maintain best practices.",
        "Refactor an application to incorporate complex design patterns.",
        "Submit a design brief and demonstrate the resulting performance improvements in application scalability and maintainability.",
        hoursPerDay + 3,
      ),
      generateOtherDay(
        skillName,
        level,
        hoursPerDay,
        5,
        "Project",
        "Apply your " # skillName # " knowledge by developing a comprehensive project that demonstrates your proficiency.",
        "Design a full-scale application from scratch using " # skillName # ". Incorporate advanced features and ensure optimal performance.",
        "Create a portfolio project. Submit the final product and documentation.",
        "Deliver a final presentation, complete with project documentation, user guides, and a summary of your " # skillName # " expertise.",
        hoursPerDay,
      ),
      generateOtherDay(
        skillName,
        level,
        hoursPerDay,
        6,
        "Review",
        "Comprehensively review your " # skillName # " skill set. Focus on knowledge retention and competency.",
        "Take a timed assessment that thoroughly tests all aspects of " # skillName # ", including advanced application and problem-solving scenarios.",
        "Complete hands-on testing and practical exercises.",
        "Achieve a passing score in the assessment and submit your documentation for final approval.",
        hoursPerDay,
      ),
      generateOtherDay(
        skillName,
        level,
        hoursPerDay,
        7,
        "Assessment",
        "Resolve real-world case studies using advanced " # skillName # " techniques.",
        "Act as a consultant and solve practical business problems using your new skills.",
        "Submit a technical report containing proposed solutions and their justification.",
        "Your documented master skill set will support promotions, salary increases, and freelance opportunities.",
        hoursPerDay + 1,
      ),
    ];
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
        url = "http://example.com/advanced-resources";
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
