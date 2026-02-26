import { useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { useGetPublicPlanView } from "../hooks/useQueries";
import type { PublicPlanView, DayPlan } from "../backend";
import ProgressTracker from "../components/ProgressTracker";
import ProgressGraph from "../components/ProgressGraph";
import DownloadPdfButton from "../components/DownloadPdfButton";
import {
  Target,
  Zap,
  CheckCircle,
  Clock,
  BookOpen,
  Trophy,
  AlertTriangle,
  ExternalLink,
  Star,
} from "lucide-react";

// Skill resource map for bonus resources
const SKILL_RESOURCE_MAP: Record<string, string> = {
  javascript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
  python: "https://docs.python.org/3/tutorial/",
  html: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  css: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  java: "https://docs.oracle.com/en/java/",
  react: "https://react.dev/",
  git: "https://git-scm.com/doc",
  rust: "https://doc.rust-lang.org/book/",
  typescript: "https://www.typescriptlang.org/docs/",
  motoko:
    "https://internetcomputer.org/docs/current/developer-docs/backend/motoko/guide",
};

function getSafeBonusResourceUrl(plan: PublicPlanView): string {
  const backendUrl = plan.bonusResource?.url;
  if (backendUrl && backendUrl.startsWith("https://")) {
    return backendUrl;
  }
  const skillKey = plan.skillName?.toLowerCase().trim();
  if (skillKey && SKILL_RESOURCE_MAP[skillKey]) {
    return SKILL_RESOURCE_MAP[skillKey];
  }
  if (plan.skillName) {
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(plan.skillName)}`;
  }
  return "";
}

// Generate progressive sample content for days 2-7
function generateSampleDay(
  dayNumber: number,
  skillName: string,
  skillLevel: string,
  hoursPerDay: bigint
): DayPlan {
  const hours = Number(hoursPerDay);
  
  const contentMap: Record<number, { objectives: string; actionTask: string; practiceExercise: string; deliverable: string }> = {
    2: {
      objectives: `Build on Day 1 foundations and introduce intermediate ${skillName} concepts. Deepen your understanding through structured practice.`,
      actionTask: `Study core ${skillName} principles and apply them in a hands-on project. Focus on understanding "why" behind each concept.`,
      practiceExercise: `Complete 3-5 exercises that combine Day 1 and Day 2 concepts. Document your approach and results.`,
      deliverable: `A working example that demonstrates mastery of fundamental ${skillName} techniques. Include detailed notes.`
    },
    3: {
      objectives: `Master intermediate ${skillName} techniques and explore real-world applications. Build confidence through practical implementation.`,
      actionTask: `Work on a mini-project that mirrors industry use cases. Apply best practices and optimize your workflow.`,
      practiceExercise: `Tackle 2-3 challenging exercises that push your boundaries. Debug issues independently and document solutions.`,
      deliverable: `A polished mini-project showcasing intermediate ${skillName} skills. Include a brief write-up explaining your design choices.`
    },
    4: {
      objectives: `Advance to complex ${skillName} patterns and techniques. Focus on efficiency, scalability, and professional-grade execution.`,
      actionTask: `Build a comprehensive project component that integrates multiple concepts. Optimize for performance and maintainability.`,
      practiceExercise: `Complete advanced exercises involving edge cases and complex scenarios. Practice troubleshooting and refactoring.`,
      deliverable: `A sophisticated project module demonstrating advanced ${skillName} proficiency. Include performance metrics if applicable.`
    },
    5: {
      objectives: `Synthesize all learned concepts into a cohesive, production-ready project. Emphasize quality, testing, and documentation.`,
      actionTask: `Develop a significant portion of your capstone project. Apply industry standards for code quality and architecture.`,
      practiceExercise: `Implement testing and validation for your work. Review and refactor code for clarity and efficiency.`,
      deliverable: `A substantial, well-tested project component with comprehensive documentation. Ready for peer review.`
    },
    6: {
      objectives: `Refine your ${skillName} expertise through advanced patterns and optimization techniques. Prepare for real-world deployment.`,
      actionTask: `Complete your capstone project with full functionality. Add error handling, edge case management, and user experience polish.`,
      practiceExercise: `Conduct thorough testing and optimization. Identify and fix bottlenecks. Gather feedback and iterate.`,
      deliverable: `A near-complete, production-ready project showcasing professional ${skillName} mastery. Include deployment considerations.`
    },
    7: {
      objectives: `Finalize your ${skillName} sprint with a polished, portfolio-worthy project. Reflect on your journey and plan next steps.`,
      actionTask: `Add final touches, documentation, and presentation materials. Prepare to showcase your work professionally.`,
      practiceExercise: `Present your project to peers or mentors. Articulate your learning journey and technical decisions confidently.`,
      deliverable: `A complete, portfolio-ready ${skillName} project with full documentation, demo, and reflection on your 7-day learning sprint.`
    }
  };

  const content = contentMap[dayNumber] || contentMap[7];

  return {
    objectives: content.objectives,
    actionTask: content.actionTask,
    practiceExercise: content.practiceExercise,
    deliverable: content.deliverable,
    estimatedTime: hoursPerDay,
  };
}

interface DayCardProps {
  dayNumber: number;
  dayPlan: DayPlan;
}

function DayCard({ dayNumber, dayPlan }: DayCardProps) {
  const dayColors = [
    { border: "border-neon-purple", bg: "bg-neon-purple/10", text: "text-neon-purple", glow: "shadow-glow-purple" },
    { border: "border-neon-pink",   bg: "bg-neon-pink/10",   text: "text-neon-pink",   glow: "shadow-glow-pink"   },
    { border: "border-neon-cyan",   bg: "bg-neon-cyan/10",   text: "text-neon-cyan",   glow: "shadow-glow-cyan"   },
    { border: "border-neon-lime",   bg: "bg-neon-lime/10",   text: "text-neon-lime",   glow: ""                   },
    { border: "border-neon-orange", bg: "bg-neon-orange/10", text: "text-neon-orange", glow: ""                   },
    { border: "border-neon-yellow", bg: "bg-neon-yellow/10", text: "text-neon-yellow", glow: ""                   },
    { border: "border-neon-purple", bg: "bg-neon-purple/10", text: "text-neon-purple", glow: "shadow-glow-purple" },
  ];

  const color = dayColors[(dayNumber - 1) % dayColors.length];

  return (
    <div className={`rounded-2xl border-2 ${color.border} ${color.glow} bg-card p-6`}>
      <div className={`inline-flex items-center gap-2 ${color.bg} ${color.text} rounded-full px-3 py-1 text-sm font-bold mb-4`}>
        <Zap className="w-3 h-3" />
        Day {dayNumber}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className={`w-4 h-4 ${color.text}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Objective</span>
          </div>
          <p className="text-sm text-foreground">{dayPlan.objectives}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className={`w-4 h-4 ${color.text}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Action Task</span>
          </div>
          <p className="text-sm text-foreground">{dayPlan.actionTask}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className={`w-4 h-4 ${color.text}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Practice Exercise</span>
          </div>
          <p className="text-sm text-foreground">{dayPlan.practiceExercise}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className={`w-4 h-4 ${color.text}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Deliverable</span>
          </div>
          <p className="text-sm text-foreground">{dayPlan.deliverable}</p>
        </div>

        <div className={`flex items-center gap-2 ${color.bg} rounded-xl px-3 py-2`}>
          <Clock className={`w-4 h-4 ${color.text}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estimated Time:</span>
          <span className={`text-sm font-black ${color.text}`}>{Number(dayPlan.estimatedTime)}h</span>
        </div>
      </div>
    </div>
  );
}

export default function UnlockPage() {
  // Accept planId from query params: /unlock?planId=123
  const search = useSearch({ from: "/unlock" }) as { planId?: string };
  const planId = search.planId || "1"; // Default to "1" if no planId provided
  const { data: plan, isLoading, isError } = useGetPublicPlanView(planId);
  const [completedDays, setCompletedDays] = useState<boolean[]>(Array(7).fill(false));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto animate-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-bold gradient-text">Loading your sprint plan...</p>
          <p className="text-sm text-muted-foreground">Hang tight, this won't take long!</p>
        </div>
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Plan Not Found</h2>
          <p className="text-muted-foreground">
            We couldn't load your sprint plan. It may have expired or the link is invalid.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 gradient-bg text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            <Zap className="w-4 h-4" />
            Create New Plan
          </a>
        </div>
      </div>
    );
  }

  const bonusResourceUrl = getSafeBonusResourceUrl(plan);

  // Day 1 comes from plan.firstDay (always available in PublicPlanView)
  const day1Plan: DayPlan = plan.firstDay;

  // Generate sample content for Days 2-7
  const allDays: DayPlan[] = [
    day1Plan,
    generateSampleDay(2, plan.skillName, plan.skillLevel, plan.hoursPerDay),
    generateSampleDay(3, plan.skillName, plan.skillLevel, plan.hoursPerDay),
    generateSampleDay(4, plan.skillName, plan.skillLevel, plan.hoursPerDay),
    generateSampleDay(5, plan.skillName, plan.skillLevel, plan.hoursPerDay),
    generateSampleDay(6, plan.skillName, plan.skillLevel, plan.hoursPerDay),
    generateSampleDay(7, plan.skillName, plan.skillLevel, plan.hoursPerDay),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-12 px-4 border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/15 via-background to-neon-pink/10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-neon-purple/10 border border-neon-purple/30 rounded-full px-3 py-1 text-xs font-bold text-neon-purple mb-3">
                <Star className="w-3 h-3" />
                🔓 Full 7-Day Sprint Unlocked!
              </div>
              <h1 className="text-3xl md:text-4xl font-black font-syne mb-2">
                <span className="gradient-text">{plan.skillName}</span> Sprint
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" /> {plan.skillLevel}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {Number(plan.hoursPerDay)}h/day
                </span>
              </div>
            </div>
            <DownloadPdfButton plan={plan} />
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Skill Overview */}
        <div className="rounded-2xl border-2 border-neon-purple/30 bg-card p-6">
          <h2 className="text-lg font-black font-syne mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-neon-purple" />
            Skill Overview
          </h2>
          <p className="text-muted-foreground leading-relaxed">{plan.skillOverview}</p>
          {plan.desiredOutcome && (
            <div className="mt-4 bg-neon-purple/10 border border-neon-purple/20 rounded-xl p-3">
              <p className="text-xs font-bold text-neon-purple uppercase tracking-wider mb-1">Your Goal</p>
              <p className="text-sm text-foreground">{plan.desiredOutcome}</p>
            </div>
          )}
        </div>

        {/* Progress Tracker */}
        <ProgressTracker
          totalDays={7}
          onCompletedDaysChange={setCompletedDays}
        />

        {/* Progress Graph */}
        <ProgressGraph completedDays={completedDays} />

        {/* Day Cards - All Unlocked */}
        <div>
          <h2 className="text-xl font-black font-syne mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-neon-yellow" />
            Your Complete 7-Day Plan
          </h2>
          <div className="space-y-4">
            {allDays.map((dayPlan, index) => {
              const dayNumber = index + 1;
              return (
                <DayCard
                  key={`day-${dayNumber}`}
                  dayNumber={dayNumber}
                  dayPlan={dayPlan}
                />
              );
            })}
          </div>
        </div>

        {/* End of Week Result */}
        <div className="rounded-2xl border-2 border-neon-lime/40 bg-neon-lime/5 p-6">
          <h2 className="text-lg font-black font-syne mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-neon-lime" />
            End of Week Result
          </h2>
          <p className="text-foreground leading-relaxed">{plan.endOfWeekResult}</p>
        </div>

        {/* Common Mistakes */}
        {plan.commonMistakes && plan.commonMistakes.length > 0 && (
          <div className="rounded-2xl border-2 border-neon-orange/40 bg-neon-orange/5 p-6">
            <h2 className="text-lg font-black font-syne mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-neon-orange" />
              Common Mistakes to Avoid
            </h2>
            <ul className="space-y-2">
              {plan.commonMistakes.map((mistake) => (
                <li key={mistake} className="flex items-start gap-3 text-sm">
                  <span className="text-neon-orange font-black mt-0.5">✗</span>
                  <span className="text-foreground">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bonus Resource */}
        {bonusResourceUrl && (
          <div className="rounded-2xl border-2 border-neon-cyan/40 bg-neon-cyan/5 p-6">
            <h2 className="text-lg font-black font-syne mb-3 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-neon-cyan" />
              Bonus Resource
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              Supercharge your learning with this curated resource:
            </p>
            <a
              href={bonusResourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-neon-cyan/10 border-2 border-neon-cyan/40 text-neon-cyan rounded-xl px-4 py-3 text-sm font-bold hover:bg-neon-cyan/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {plan.bonusResource?.title || "View Resource"}
              <span className="text-xs opacity-70 ml-1">↗</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
