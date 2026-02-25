import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Target,
  Zap,
  BookOpen,
  Clock,
  AlertTriangle,
  ExternalLink,
  Trophy,
  Loader2,
  PackageCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPlan, useGetPublicPlanView } from '@/hooks/useQueries';
import type { DayPlan, SprintPlan, PublicPlanView, Resource } from '../backend';
import ProgressTracker from '@/components/ProgressTracker';
import ProgressGraph from '@/components/ProgressGraph';
import PaywallModal from '@/components/PaywallModal';
import DownloadPdfButton from '@/components/DownloadPdfButton';

interface DayCardProps {
  day: DayPlan;
  dayNumber: number;
  isLocked?: boolean;
  animationDelay?: number;
}

function formatEstimatedTime(estimatedTime: bigint): string {
  const hours = Number(estimatedTime);
  if (hours === 1) return '1 hour';
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  return `${hours} hours`;
}

const DAY_GRADIENTS = [
  { header: 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.62 0.28 350))', border: 'oklch(0.52 0.28 295 / 0.3)', light: 'oklch(0.52 0.28 295 / 0.07)', resourceBg: 'oklch(0.52 0.28 295 / 0.06)', resourceBorder: 'oklch(0.52 0.28 295 / 0.2)', resourceHover: 'oklch(0.52 0.28 295 / 0.12)', accent: 'oklch(0.52 0.28 295)' },
  { header: 'linear-gradient(135deg, oklch(0.62 0.28 350), oklch(0.72 0.22 50))', border: 'oklch(0.62 0.28 350 / 0.3)', light: 'oklch(0.62 0.28 350 / 0.07)', resourceBg: 'oklch(0.62 0.28 350 / 0.06)', resourceBorder: 'oklch(0.62 0.28 350 / 0.2)', resourceHover: 'oklch(0.62 0.28 350 / 0.12)', accent: 'oklch(0.62 0.28 350)' },
  { header: 'linear-gradient(135deg, oklch(0.72 0.18 200), oklch(0.52 0.28 295))', border: 'oklch(0.72 0.18 200 / 0.3)', light: 'oklch(0.72 0.18 200 / 0.07)', resourceBg: 'oklch(0.72 0.18 200 / 0.06)', resourceBorder: 'oklch(0.72 0.18 200 / 0.2)', resourceHover: 'oklch(0.72 0.18 200 / 0.12)', accent: 'oklch(0.72 0.18 200)' },
  { header: 'linear-gradient(135deg, oklch(0.78 0.22 140), oklch(0.72 0.18 200))', border: 'oklch(0.78 0.22 140 / 0.3)', light: 'oklch(0.78 0.22 140 / 0.07)', resourceBg: 'oklch(0.78 0.22 140 / 0.06)', resourceBorder: 'oklch(0.78 0.22 140 / 0.2)', resourceHover: 'oklch(0.78 0.22 140 / 0.12)', accent: 'oklch(0.78 0.22 140)' },
  { header: 'linear-gradient(135deg, oklch(0.72 0.22 50), oklch(0.85 0.2 90))', border: 'oklch(0.72 0.22 50 / 0.3)', light: 'oklch(0.72 0.22 50 / 0.07)', resourceBg: 'oklch(0.72 0.22 50 / 0.06)', resourceBorder: 'oklch(0.72 0.22 50 / 0.2)', resourceHover: 'oklch(0.72 0.22 50 / 0.12)', accent: 'oklch(0.72 0.22 50)' },
  { header: 'linear-gradient(135deg, oklch(0.65 0.28 295), oklch(0.72 0.18 200))', border: 'oklch(0.65 0.28 295 / 0.3)', light: 'oklch(0.65 0.28 295 / 0.07)', resourceBg: 'oklch(0.65 0.28 295 / 0.06)', resourceBorder: 'oklch(0.65 0.28 295 / 0.2)', resourceHover: 'oklch(0.65 0.28 295 / 0.12)', accent: 'oklch(0.65 0.28 295)' },
  { header: 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.78 0.22 140))', border: 'oklch(0.52 0.28 295 / 0.3)', light: 'oklch(0.52 0.28 295 / 0.07)', resourceBg: 'oklch(0.52 0.28 295 / 0.06)', resourceBorder: 'oklch(0.52 0.28 295 / 0.2)', resourceHover: 'oklch(0.52 0.28 295 / 0.12)', accent: 'oklch(0.52 0.28 295)' },
];

const DAY_EMOJIS = ['🌅', '⚡', '🔥', '💡', '🚀', '🎯', '🏆'];

function ResourceLink({ resource, colorScheme }: { resource: Resource; colorScheme: typeof DAY_GRADIENTS[0] }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-2xl border transition-all duration-200 group"
      style={{
        background: hovered ? colorScheme.resourceHover : colorScheme.resourceBg,
        borderColor: hovered ? colorScheme.accent : colorScheme.resourceBorder,
        transform: hovered ? 'scale(1.01)' : 'scale(1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-lg flex-shrink-0 mt-0.5">📚</span>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-bold leading-snug transition-colors"
          style={{ color: hovered ? colorScheme.accent : 'var(--foreground)' }}
        >
          {resource.title}
        </p>
        {resource.description && (
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
            {resource.description}
          </p>
        )}
      </div>
      <ExternalLink
        className="w-3.5 h-3.5 flex-shrink-0 mt-1 transition-colors"
        style={{ color: hovered ? colorScheme.accent : 'var(--muted-foreground)' }}
      />
    </a>
  );
}

function DayCard({ day, dayNumber, isLocked = false, animationDelay = 0 }: DayCardProps) {
  const colorScheme = DAY_GRADIENTS[(dayNumber - 1) % DAY_GRADIENTS.length];
  const emoji = DAY_EMOJIS[(dayNumber - 1) % DAY_EMOJIS.length];
  const hasResources = day.resources && day.resources.length > 0;

  return (
    <div
      className={`rounded-3xl border-2 overflow-hidden card-shadow-md animate-slide-up animate-fill-both ${isLocked ? 'locked-blur' : ''}`}
      style={{
        borderColor: colorScheme.border,
        background: 'white',
        animationDelay: `${animationDelay}ms`,
      }}
    >
      {/* Day header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: colorScheme.header }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl">
            {emoji}
          </div>
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Day</p>
            <p className="text-white font-display font-extrabold text-xl leading-tight">{dayNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 backdrop-blur-sm">
          <Clock className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-xs font-bold">{formatEstimatedTime(day.estimatedTime)}</span>
        </div>
      </div>

      {/* Day content */}
      <div className="p-5 space-y-3.5">
        <DayField
          icon="🎯"
          label="Objective"
          value={day.objectives}
          bgColor={colorScheme.light}
        />
        <DayField
          icon="⚡"
          label="Action Task"
          value={day.actionTask}
          bgColor="oklch(0.85 0.2 90 / 0.08)"
        />
        <DayField
          icon="💪"
          label="Practice Exercise"
          value={day.practiceExercise}
          bgColor="oklch(0.78 0.22 140 / 0.08)"
        />
        <DayField
          icon="📦"
          label="Deliverable"
          value={day.deliverable}
          bgColor="oklch(0.72 0.18 200 / 0.08)"
        />

        {/* Study Resources — always visible */}
        <div
          className="rounded-2xl overflow-hidden border"
          style={{ borderColor: colorScheme.resourceBorder }}
        >
          {/* Section header */}
          <div
            className="px-4 py-2.5 flex items-center gap-2"
            style={{ background: colorScheme.header }}
          >
            <span className="text-base">📚</span>
            <p className="text-white text-xs font-bold uppercase tracking-wider">
              Study Resources
            </p>
          </div>

          {/* Resources list */}
          <div className="p-3 space-y-2" style={{ background: colorScheme.resourceBg }}>
            {hasResources ? (
              day.resources.map((resource, i) => (
                <ResourceLink key={i} resource={resource} colorScheme={colorScheme} />
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic text-center py-2">
                No resources available for this day.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DayField({ icon, label, value, bgColor }: { icon: string; label: string; value: string; bgColor: string }) {
  return (
    <div className="rounded-2xl p-3" style={{ background: bgColor }}>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
        <span>{icon}</span>
        {label}
      </p>
      <p className="text-sm text-foreground leading-relaxed font-medium">
        {value || <span className="text-muted-foreground italic">—</span>}
      </p>
    </div>
  );
}

function LockedDayCard({ dayNumber, animationDelay = 0 }: { dayNumber: number; animationDelay?: number }) {
  const colorScheme = DAY_GRADIENTS[(dayNumber - 1) % DAY_GRADIENTS.length];
  const emoji = DAY_EMOJIS[(dayNumber - 1) % DAY_EMOJIS.length];

  return (
    <div
      className="rounded-3xl border-2 overflow-hidden card-shadow relative animate-slide-up animate-fill-both"
      style={{ borderColor: colorScheme.border, background: 'white', animationDelay: `${animationDelay}ms` }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px] z-10 flex items-center justify-center rounded-3xl">
        <div className="flex flex-col items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: colorScheme.header }}
          >
            <Lock className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
            style={{ background: colorScheme.header }}
          >
            🔒 Unlock to view
          </span>
        </div>
      </div>
      <div className="px-5 py-4 flex items-center gap-3" style={{ background: colorScheme.header }}>
        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl">{emoji}</div>
        <div>
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Day</p>
          <p className="text-white font-display font-extrabold text-xl">{dayNumber}</p>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-2xl p-3 bg-secondary">
            <div className="h-2 w-20 bg-muted rounded mb-2" />
            <div className="h-3 w-full bg-muted rounded" />
            <div className="h-3 w-3/4 bg-muted rounded mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-3xl" />
      <Skeleton className="h-24 w-full rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-64 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

export default function PlanResults() {
  const { planId } = useParams({ from: '/plan/$planId' });
  const navigate = useNavigate();
  const [completedDays, setCompletedDays] = useState<boolean[]>(Array(7).fill(false));

  const planQuery = useGetPlan(planId);
  const publicQuery = useGetPublicPlanView(planId);

  const plan = planQuery.data;
  const publicView = publicQuery.data;

  const isUnlocked = plan?.unlockedStatus === true;
  const isLoading = planQuery.isLoading || publicQuery.isLoading;

  const handleUnlocked = () => {
    planQuery.refetch();
    publicQuery.refetch();
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-9 w-24 rounded-2xl" />
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!plan && !publicView) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'linear-gradient(135deg, oklch(0.62 0.28 350 / 0.15), oklch(0.52 0.28 295 / 0.1))' }}
        >
          <AlertTriangle className="w-8 h-8" style={{ color: 'oklch(0.62 0.28 350)' }} />
        </div>
        <h2 className="font-display font-bold text-xl text-foreground mb-2">Plan Not Found 😕</h2>
        <p className="text-muted-foreground text-sm mb-6">This plan doesn't exist or may have expired.</p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="px-6 py-3 rounded-2xl text-white font-bold transition-all"
          style={{ background: 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.62 0.28 350))' }}
        >
          Create a New Sprint 🚀
        </button>
      </div>
    );
  }

  const displayData = isUnlocked && plan ? plan : publicView;
  if (!displayData) return null;

  const skillName = displayData.skillName;
  const skillLevel = displayData.skillLevel;
  const hoursPerDay = Number(displayData.hoursPerDay);
  const desiredOutcome = displayData.desiredOutcome;
  const skillOverview = displayData.skillOverview;
  const endOfWeekResult = displayData.endOfWeekResult;
  const commonMistakes = displayData.commonMistakes;
  const bonusResource = displayData.bonusResource;

  const firstDay = isUnlocked && plan ? plan.days[0] : (publicView as PublicPlanView)?.firstDay;
  const allDays = isUnlocked && plan ? plan.days : null;

  const levelEmoji: Record<string, string> = {
    Beginner: '🌱',
    Intermediate: '⚡',
    Advanced: '🔥',
  };

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Back + actions bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap animate-slide-in-left delay-0 animate-fill-both">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-2xl hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
          New Sprint
        </button>

        <div className="flex items-center gap-2">
          {isUnlocked && plan && <DownloadPdfButton plan={plan} />}
          {isUnlocked && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.78 0.22 140), oklch(0.72 0.18 200))' }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Unlocked 🎉
            </span>
          )}
        </div>
      </div>

      {/* Hero Card */}
      <div
        className="rounded-3xl p-6 text-white card-shadow-md overflow-hidden relative animate-slide-up delay-100 animate-fill-both"
        style={{ background: 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.62 0.28 350), oklch(0.72 0.18 200))' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4"
          style={{ background: 'radial-gradient(circle, white, transparent)' }}
        />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 translate-y-1/2 -translate-x-1/4"
          style={{ background: 'radial-gradient(circle, white, transparent)' }}
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">🚀 Your Sprint</p>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight">{skillName}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white">
                {levelEmoji[skillLevel] || '📊'} {skillLevel}
              </span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {hoursPerDay}h/day
              </span>
            </div>
          </div>

          <div className="bg-white/15 rounded-2xl p-3.5 mb-4 border border-white/20 backdrop-blur-sm">
            <p className="text-xs text-white/70 font-bold uppercase tracking-wider mb-1">🎯 Your Goal</p>
            <p className="text-white text-sm leading-relaxed font-medium">{desiredOutcome}</p>
          </div>

          <div>
            <p className="text-xs text-white/70 font-bold uppercase tracking-wider mb-1.5">📖 Overview</p>
            <p className="text-white/90 text-sm leading-relaxed">{skillOverview}</p>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="animate-slide-up delay-200 animate-fill-both">
        <ProgressTracker
          totalDays={7}
          unlockedDays={isUnlocked ? 7 : 1}
          onCompletedDaysChange={setCompletedDays}
        />
      </div>

      {/* Progress Graph */}
      <div className="animate-slide-up delay-300 animate-fill-both">
        <ProgressGraph completedDays={completedDays} />
      </div>

      {/* Day Plans */}
      <div className="animate-slide-up delay-400 animate-fill-both">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display font-bold text-xl gradient-text-rainbow">📅 7-Day Plan</h2>
          {!isUnlocked && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'oklch(0.52 0.28 295 / 0.1)', color: 'oklch(0.42 0.28 295)', border: '1px solid oklch(0.52 0.28 295 / 0.3)' }}
            >
              Day 1 preview 👀
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Day 1 - always visible */}
          {firstDay && <DayCard day={firstDay} dayNumber={1} animationDelay={0} />}

          {/* Days 2-7 */}
          {isUnlocked && allDays ? (
            allDays.slice(1).map((day, i) => (
              <DayCard key={i + 2} day={day} dayNumber={i + 2} animationDelay={(i + 1) * 80} />
            ))
          ) : (
            [2, 3, 4, 5, 6, 7].map((dayNum, i) => (
              <LockedDayCard key={dayNum} dayNumber={dayNum} animationDelay={i * 80} />
            ))
          )}
        </div>
      </div>

      {/* Paywall */}
      {!isUnlocked && (
        <div className="animate-slide-up delay-500 animate-fill-both">
          <PaywallModal planId={planId} onUnlocked={handleUnlocked} />
        </div>
      )}

      {/* End of Week Result */}
      {isUnlocked && (
        <div className="rounded-3xl border-2 overflow-hidden card-shadow-md animate-fade-in"
          style={{ borderColor: 'oklch(0.85 0.2 90 / 0.4)', background: 'white' }}
        >
          <div className="px-6 py-4 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, oklch(0.85 0.2 90 / 0.15), oklch(0.72 0.22 50 / 0.1))' }}
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, oklch(0.85 0.2 90), oklch(0.72 0.22 50))' }}
            >
              🏆
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-foreground">End of Week Result</h3>
              <p className="text-xs text-muted-foreground">What you'll achieve after 7 days 🎉</p>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-foreground leading-relaxed font-medium p-4 rounded-2xl"
              style={{ background: 'oklch(0.85 0.2 90 / 0.08)' }}
            >
              {endOfWeekResult}
            </p>
          </div>
        </div>
      )}

      {/* Common Mistakes */}
      {isUnlocked && commonMistakes && commonMistakes.length > 0 && (
        <div className="rounded-3xl border-2 overflow-hidden card-shadow-md animate-fade-in"
          style={{ borderColor: 'oklch(0.62 0.28 350 / 0.3)', background: 'white' }}
        >
          <div className="px-6 py-4 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, oklch(0.62 0.28 350 / 0.12), oklch(0.72 0.22 50 / 0.08))' }}
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, oklch(0.62 0.28 350), oklch(0.72 0.22 50))' }}
            >
              ⚠️
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-foreground">Common Mistakes</h3>
              <p className="text-xs text-muted-foreground">Avoid these pitfalls on your journey 🚧</p>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-2.5">
              {commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground font-medium p-3 rounded-2xl"
                  style={{ background: 'oklch(0.62 0.28 350 / 0.06)' }}
                >
                  <span className="text-base flex-shrink-0">❌</span>
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Bonus Resource */}
      {isUnlocked && bonusResource && (
        <div className="rounded-3xl border-2 overflow-hidden card-shadow-md animate-fade-in"
          style={{ borderColor: 'oklch(0.72 0.18 200 / 0.3)', background: 'white' }}
        >
          <div className="px-6 py-4 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 200 / 0.12), oklch(0.52 0.28 295 / 0.08))' }}
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 200), oklch(0.52 0.28 295))' }}
            >
              🎁
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-foreground">Bonus Resource</h3>
              <p className="text-xs text-muted-foreground">Extra material to supercharge your learning ✨</p>
            </div>
          </div>
          <div className="p-6">
            <a
              href={bonusResource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 group hover:scale-[1.01]"
              style={{
                background: 'oklch(0.72 0.18 200 / 0.06)',
                borderColor: 'oklch(0.72 0.18 200 / 0.25)',
              }}
            >
              <span className="text-2xl">🔗</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground group-hover:text-neon-purple transition-colors">
                  {bonusResource.title}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{bonusResource.url}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-neon-purple transition-colors flex-shrink-0" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
