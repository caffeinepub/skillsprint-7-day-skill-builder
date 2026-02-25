import React, { useEffect } from 'react';
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
  BarChart3,
  PackageCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPlan, useGetPublicPlanView } from '@/hooks/useQueries';
import type { DayPlan, SprintPlan, PublicPlanView } from '../backend';
import ProgressTracker from '@/components/ProgressTracker';
import PaywallModal from '@/components/PaywallModal';
import DownloadPdfButton from '@/components/DownloadPdfButton';

interface DayCardProps {
  day: DayPlan;
  dayNumber: number;
  isLocked?: boolean;
}

function formatEstimatedTime(estimatedTime: bigint): string {
  const hours = Number(estimatedTime);
  if (hours === 1) return '1 hour';
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  return `${hours} hours`;
}

function DayCard({ day, dayNumber, isLocked = false }: DayCardProps) {
  const dayColors = [
    'from-blue-500 to-blue-600',
    'from-violet-500 to-violet-600',
    'from-emerald-500 to-emerald-600',
    'from-amber-500 to-amber-600',
    'from-rose-500 to-rose-600',
    'from-cyan-500 to-cyan-600',
    'from-indigo-500 to-indigo-600',
  ];
  const gradient = dayColors[(dayNumber - 1) % dayColors.length];

  return (
    <div className={`bg-card rounded-2xl border border-border card-shadow overflow-hidden ${isLocked ? 'locked-blur' : 'animate-fade-in'}`}>
      {/* Day header */}
      <div className={`bg-gradient-to-r ${gradient} px-5 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">{dayNumber}</span>
          </div>
          <div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Day</p>
            <p className="text-white font-display font-bold text-base leading-tight">{dayNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
          <Clock className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-xs font-semibold">{formatEstimatedTime(day.estimatedTime)}</span>
        </div>
      </div>

      {/* Day content */}
      <div className="p-5 space-y-4">
        <DayField
          icon={<Target className="w-4 h-4 text-blue-500" />}
          label="Objective"
          value={day.objectives}
        />
        <DayField
          icon={<Zap className="w-4 h-4 text-amber-500" />}
          label="Action Task"
          value={day.actionTask}
        />
        <DayField
          icon={<BookOpen className="w-4 h-4 text-emerald-500" />}
          label="Practice Exercise"
          value={day.practiceExercise}
        />
        <DayField
          icon={<PackageCheck className="w-4 h-4 text-violet-500" />}
          label="Deliverable"
          value={day.deliverable}
        />
        <DayField
          icon={<Clock className="w-4 h-4 text-rose-500" />}
          label="Estimated Time"
          value={formatEstimatedTime(day.estimatedTime)}
        />
      </div>
    </div>
  );
}

function DayField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm text-foreground leading-relaxed">{value || <span className="text-muted-foreground italic">—</span>}</p>
      </div>
    </div>
  );
}

function LockedDayCard({ dayNumber }: { dayNumber: number }) {
  return (
    <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden relative">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Unlock to view
          </span>
        </div>
      </div>
      <div className="px-5 py-4 bg-secondary/50 flex items-center gap-3">
        <div className="w-9 h-9 bg-muted rounded-xl" />
        <div className="space-y-1.5">
          <div className="h-3 w-12 bg-muted rounded" />
          <div className="h-2 w-20 bg-muted rounded" />
        </div>
      </div>
      <div className="p-5 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2 w-20 bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-3/4 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function PlanResults() {
  const { planId } = useParams({ from: '/plan/$planId' });
  const navigate = useNavigate();

  const planQuery = useGetPlan(planId);
  const publicQuery = useGetPublicPlanView(planId);

  const plan = planQuery.data;
  const publicView = publicQuery.data;

  const isUnlocked = plan?.unlockedStatus === true;
  const isLoading = planQuery.isLoading || publicQuery.isLoading;

  // Refetch after unlock
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
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!plan && !publicView) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="font-display font-bold text-xl text-foreground mb-2">Plan Not Found</h2>
        <p className="text-muted-foreground text-sm mb-6">This plan doesn't exist or may have expired.</p>
        <Button
          onClick={() => navigate({ to: '/' })}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          Create a New Sprint
        </Button>
      </div>
    );
  }

  // Use full plan if unlocked, otherwise use public view
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

  const levelBadgeClass = {
    Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
    Advanced: 'bg-red-50 text-red-700 border-red-200',
  }[skillLevel] || 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-slide-up">
      {/* Back + actions bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="text-muted-foreground hover:text-foreground rounded-xl gap-1.5 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          New Sprint
        </Button>

        <div className="flex items-center gap-2">
          {isUnlocked && plan && <DownloadPdfButton plan={plan} />}
          {isUnlocked && (
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Unlocked
            </Badge>
          )}
        </div>
      </div>

      {/* Skill Overview Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white card-shadow-md">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Your Sprint</p>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight">{skillName}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border bg-white/10 border-white/20 text-white`}>
              {skillLevel}
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {hoursPerDay}h/day
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-3 mb-4 border border-white/20">
          <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider mb-1">Goal</p>
          <p className="text-white text-sm leading-relaxed">{desiredOutcome}</p>
        </div>

        <div>
          <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider mb-1.5">Overview</p>
          <p className="text-blue-50 text-sm leading-relaxed">{skillOverview}</p>
        </div>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker totalDays={7} unlockedDays={isUnlocked ? 7 : 1} />

      {/* Day Plans */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display font-bold text-lg text-foreground">7-Day Plan</h2>
          {!isUnlocked && (
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border">
              Day 1 preview
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Day 1 - always visible */}
          {firstDay && <DayCard day={firstDay} dayNumber={1} />}

          {/* Days 2-7 */}
          {isUnlocked && allDays ? (
            allDays.slice(1).map((day, i) => (
              <DayCard key={i + 2} day={day} dayNumber={i + 2} />
            ))
          ) : (
            [2, 3, 4, 5, 6, 7].map((dayNum) => (
              <LockedDayCard key={dayNum} dayNumber={dayNum} />
            ))
          )}
        </div>
      </div>

      {/* Paywall (shown when locked) */}
      {!isUnlocked && (
        <PaywallModal planId={planId} onUnlocked={handleUnlocked} />
      )}

      {/* End of Week Result */}
      {isUnlocked && (
        <div className="bg-card rounded-2xl border border-border card-shadow p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-foreground">End of Week Result</h3>
              <p className="text-xs text-muted-foreground">What you'll achieve after 7 days</p>
            </div>
          </div>
          <p className="text-sm text-foreground leading-relaxed bg-amber-50 border border-amber-100 rounded-xl p-4">
            {endOfWeekResult}
          </p>
        </div>
      )}

      {/* Common Mistakes */}
      {isUnlocked && (
        <div className="bg-card rounded-2xl border border-border card-shadow p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-foreground">3 Common Mistakes</h3>
              <p className="text-xs text-muted-foreground">Avoid these pitfalls</p>
            </div>
          </div>
          <ul className="space-y-2.5">
            {commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground leading-relaxed">{mistake}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bonus Resource */}
      {isUnlocked && (
        <div className="bg-card rounded-2xl border border-border card-shadow p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-foreground">Bonus Resource</h3>
              <p className="text-xs text-muted-foreground">Recommended reading / tool</p>
            </div>
          </div>
          <a
            href={bonusResource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 hover:bg-blue-100 transition-colors group"
          >
            <div>
              <p className="text-sm font-semibold text-blue-800 group-hover:text-blue-900">{bonusResource.title}</p>
              <p className="text-xs text-blue-600 mt-0.5 truncate max-w-xs">{bonusResource.url}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0" />
          </a>
        </div>
      )}

      {/* Bottom CTA for locked plans */}
      {!isUnlocked && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Unlock all 7 days, mistakes, and bonus resource for just{' '}
            <span className="font-bold text-blue-600">₹20</span>
          </p>
        </div>
      )}
    </div>
  );
}
