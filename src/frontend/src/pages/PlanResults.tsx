import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useGetPublicPlanView } from "../hooks/useQueries";
import type { PublicPlanView, DayPlan } from "../backend";
import PaywallModal from "../components/PaywallModal";
import ProgressTracker from "../components/ProgressTracker";
import ProgressGraph from "../components/ProgressGraph";
import DownloadPdfButton from "../components/DownloadPdfButton";
import {
  Lock,
  Unlock,
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

interface DayCardProps {
  dayNumber: number;
  dayPlan: DayPlan;
  isLocked: boolean;
  onUnlock: () => void;
}

function DayCard({ dayNumber, dayPlan, isLocked, onUnlock }: DayCardProps) {
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

  if (isLocked) {
    return (
      <div className={`relative rounded-2xl border-2 ${color.border} bg-card overflow-hidden`}>
        {/* Blurred content preview */}
        <div className="blur-sm pointer-events-none select-none p-6 opacity-40">
          <div className={`inline-flex items-center gap-2 ${color.bg} ${color.text} rounded-full px-3 py-1 text-sm font-bold mb-4`}>
            <Zap className="w-3 h-3" />
            Day {dayNumber}
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className={`${color.bg} ${color.border} border-2 rounded-full p-4 mb-3`}>
            <Lock className={`w-6 h-6 ${color.text}`} />
          </div>
          <p className="font-bold text-foreground mb-1">Day {dayNumber} Locked</p>
          <p className="text-xs text-muted-foreground mb-4 text-center px-4">
            Unlock the full 7-day plan to access this day
          </p>
          <button
            type="button"
            onClick={onUnlock}
            className={`${color.bg} ${color.border} border-2 ${color.text} rounded-xl px-4 py-2 text-sm font-bold hover:opacity-80 transition-opacity flex items-center gap-2`}
          >
            <Unlock className="w-4 h-4" />
            Unlock Now
          </button>
        </div>
      </div>
    );
  }

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

export default function PlanResults() {
  const { planId } = useParams({ from: "/plan/$planId" });
  const { data: plan, isLoading, isError } = useGetPublicPlanView(planId);
  const [showPaywall, setShowPaywall] = useState(false);
  // boolean[] to match ProgressTracker's onCompletedDaysChange and ProgressGraph's completedDays
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

  // Placeholder DayPlan for locked days (content is hidden behind blur)
  const lockedDayPlaceholder: DayPlan = {
    objectives: "Locked content",
    actionTask: "Locked content",
    practiceExercise: "Locked content",
    deliverable: "Locked content",
    estimatedTime: BigInt(0),
  };

  // Array of 7 days: index 0 = Day 1 (unlocked), indices 1-6 = Days 2-7 (locked)
  const allDays: DayPlan[] = [
    day1Plan,
    lockedDayPlaceholder,
    lockedDayPlaceholder,
    lockedDayPlaceholder,
    lockedDayPlaceholder,
    lockedDayPlaceholder,
    lockedDayPlaceholder,
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
                7-Day Sprint Plan Ready!
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

        {/* Progress Tracker — onCompletedDaysChange receives boolean[] */}
        <ProgressTracker
          totalDays={7}
          onCompletedDaysChange={setCompletedDays}
        />

        {/* Progress Graph — only accepts completedDays: boolean[], no totalDays prop */}
        <ProgressGraph completedDays={completedDays} />

        {/* Day Cards */}
        <div>
          <h2 className="text-xl font-black font-syne mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-neon-yellow" />
            Your 7-Day Plan
          </h2>
          <div className="space-y-4">
            {allDays.map((dayPlan, index) => {
              const dayNumber = index + 1;
              const isLocked = dayNumber > 1;
              return (
                <DayCard
                  key={dayNumber}
                  dayNumber={dayNumber}
                  dayPlan={dayPlan}
                  isLocked={isLocked}
                  onUnlock={() => setShowPaywall(true)}
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

        {/* Bonus Resource — only shown when URL is valid */}
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

        {/* Unlock CTA */}
        <div className="rounded-2xl border-2 border-neon-pink/40 gradient-bg p-8 text-center text-white">
          <div className="text-4xl mb-3">🔓</div>
          <h2 className="text-2xl font-black font-syne mb-2">Unlock All 7 Days!</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Get access to the complete sprint plan with all 7 days of personalized content, exercises, and deliverables.
          </p>
          <button
            type="button"
            onClick={() => setShowPaywall(true)}
            className="bg-white text-neon-purple font-black px-8 py-3 rounded-xl hover:bg-white/90 transition-colors text-lg"
          >
            Unlock Full Plan 🚀
          </button>
        </div>
      </div>

      {/* PaywallModal has no isOpen prop — render conditionally instead */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <PaywallModal
              planId={plan.planId.toString()}
              onClose={() => setShowPaywall(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
