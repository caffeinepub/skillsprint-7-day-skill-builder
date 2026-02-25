import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  Lock,
  Clock,
  AlertTriangle,
  Trophy,
  ExternalLink,
  Star,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPublicPlanView } from '@/hooks/useQueries';
import type { DayPlan, PublicPlanView } from '../backend';
import ProgressTracker from '@/components/ProgressTracker';
import ProgressGraph from '@/components/ProgressGraph';
import PaywallModal from '@/components/PaywallModal';

// ---------------------------------------------------------------------------
// Bonus resource URL sanitization
// ---------------------------------------------------------------------------

function getSafeBonusResourceUrl(url: string, skillName: string): string {
  if (!url || !url.startsWith('https://')) {
    return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(skillName)}`;
  }
  const wikiProgLangPattern = /^https:\/\/en\.wikipedia\.org\/wiki\/(.+)_programming_language$/;
  if (wikiProgLangPattern.test(url)) {
    const match = url.match(wikiProgLangPattern);
    const skill = match ? decodeURIComponent(match[1]) : skillName;
    return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(skill)}`;
  }
  return url;
}

/** Frontend lookup table — verified real HTTPS URLs for common skills. */
const SKILL_RESOURCE_MAP: Record<string, { title: string; url: string }> = {
  javascript: { title: 'MDN JavaScript Guide (Official)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
  python: { title: 'Python Official Documentation', url: 'https://docs.python.org/3/tutorial/' },
  html: { title: 'MDN HTML Guide (Official)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  css: { title: 'MDN CSS Guide (Official)', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  java: { title: 'Java Documentation (Oracle)', url: 'https://docs.oracle.com/en/java/' },
  react: { title: 'React Official Documentation', url: 'https://react.dev/' },
  git: { title: 'Git Official Documentation', url: 'https://git-scm.com/doc' },
  rust: { title: 'Rust Official Documentation', url: 'https://doc.rust-lang.org/book/' },
  typescript: { title: 'TypeScript Official Documentation', url: 'https://www.typescriptlang.org/docs/' },
  motoko: { title: 'Motoko Official Documentation', url: 'https://internetcomputer.org/docs/current/developer-docs/backend/motoko/guide' },
  sql: { title: 'SQL Tutorial – W3Schools', url: 'https://www.w3schools.com/sql/' },
  excel: { title: 'Microsoft Excel Help & Learning', url: 'https://support.microsoft.com/en-us/excel' },
  nodejs: { title: 'Node.js Official Documentation', url: 'https://nodejs.org/en/docs/' },
  'node.js': { title: 'Node.js Official Documentation', url: 'https://nodejs.org/en/docs/' },
  vue: { title: 'Vue.js Official Documentation', url: 'https://vuejs.org/guide/introduction.html' },
  angular: { title: 'Angular Official Documentation', url: 'https://angular.dev/overview' },
  docker: { title: 'Docker Official Documentation', url: 'https://docs.docker.com/get-started/' },
  kubernetes: { title: 'Kubernetes Official Documentation', url: 'https://kubernetes.io/docs/home/' },
  go: { title: 'Go Official Documentation', url: 'https://go.dev/doc/' },
  golang: { title: 'Go Official Documentation', url: 'https://go.dev/doc/' },
  swift: { title: 'Swift Official Documentation', url: 'https://www.swift.org/documentation/' },
  kotlin: { title: 'Kotlin Official Documentation', url: 'https://kotlinlang.org/docs/home.html' },
  php: { title: 'PHP Official Documentation', url: 'https://www.php.net/docs.php' },
  ruby: { title: 'Ruby Official Documentation', url: 'https://www.ruby-lang.org/en/documentation/' },
  'c++': { title: 'C++ Reference', url: 'https://en.cppreference.com/w/cpp' },
  'c#': { title: 'C# Documentation (Microsoft)', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/' },
  flutter: { title: 'Flutter Official Documentation', url: 'https://docs.flutter.dev/' },
  dart: { title: 'Dart Official Documentation', url: 'https://dart.dev/guides' },
  nextjs: { title: 'Next.js Official Documentation', url: 'https://nextjs.org/docs' },
  'next.js': { title: 'Next.js Official Documentation', url: 'https://nextjs.org/docs' },
  tailwind: { title: 'Tailwind CSS Official Documentation', url: 'https://tailwindcss.com/docs' },
  tailwindcss: { title: 'Tailwind CSS Official Documentation', url: 'https://tailwindcss.com/docs' },
  graphql: { title: 'GraphQL Official Documentation', url: 'https://graphql.org/learn/' },
  mongodb: { title: 'MongoDB Official Documentation', url: 'https://www.mongodb.com/docs/' },
  postgresql: { title: 'PostgreSQL Official Documentation', url: 'https://www.postgresql.org/docs/' },
  mysql: { title: 'MySQL Official Documentation', url: 'https://dev.mysql.com/doc/' },
  aws: { title: 'AWS Documentation', url: 'https://docs.aws.amazon.com/' },
  linux: { title: 'Linux Documentation Project', url: 'https://tldp.org/' },
  bash: { title: 'Bash Reference Manual (GNU)', url: 'https://www.gnu.org/software/bash/manual/' },
  figma: { title: 'Figma Help Center', url: 'https://help.figma.com/hc/en-us' },
  photoshop: { title: 'Adobe Photoshop Tutorials', url: 'https://helpx.adobe.com/photoshop/tutorials.html' },
};

function getReliableBonusResource(
  skillName: string,
  bonusResource: { title: string; url: string }
): { title: string; url: string } {
  const key = skillName.toLowerCase().trim();
  if (SKILL_RESOURCE_MAP[key]) return SKILL_RESOURCE_MAP[key];
  const safeUrl = getSafeBonusResourceUrl(bonusResource.url, skillName);
  return { title: bonusResource.title, url: safeUrl };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface DayCardProps {
  day: DayPlan;
  dayNumber: number;
  animationDelay?: number;
}

function formatEstimatedTime(estimatedTime: bigint): string {
  const hours = Number(estimatedTime);
  if (hours === 1) return '1 hour';
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  return `${hours} hours`;
}

const DAY_GRADIENTS = [
  { header: 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.62 0.28 350))', border: 'oklch(0.52 0.28 295 / 0.3)', light: 'oklch(0.52 0.28 295 / 0.07)', accent: 'oklch(0.52 0.28 295)' },
  { header: 'linear-gradient(135deg, oklch(0.62 0.28 350), oklch(0.72 0.22 50))', border: 'oklch(0.62 0.28 350 / 0.3)', light: 'oklch(0.62 0.28 350 / 0.07)', accent: 'oklch(0.62 0.28 350)' },
  { header: 'linear-gradient(135deg, oklch(0.72 0.18 200), oklch(0.52 0.28 295))', border: 'oklch(0.72 0.18 200 / 0.3)', light: 'oklch(0.72 0.18 200 / 0.07)', accent: 'oklch(0.72 0.18 200)' },
  { header: 'linear-gradient(135deg, oklch(0.78 0.22 140), oklch(0.72 0.18 200))', border: 'oklch(0.78 0.22 140 / 0.3)', light: 'oklch(0.78 0.22 140 / 0.07)', accent: 'oklch(0.78 0.22 140)' },
  { header: 'linear-gradient(135deg, oklch(0.72 0.22 50), oklch(0.85 0.2 90))', border: 'oklch(0.72 0.22 50 / 0.3)', light: 'oklch(0.72 0.22 50 / 0.07)', accent: 'oklch(0.72 0.22 50)' },
  { header: 'linear-gradient(135deg, oklch(0.65 0.28 295), oklch(0.72 0.18 200))', border: 'oklch(0.65 0.28 295 / 0.3)', light: 'oklch(0.65 0.28 295 / 0.07)', accent: 'oklch(0.65 0.28 295)' },
  { header: 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.78 0.22 140))', border: 'oklch(0.52 0.28 295 / 0.3)', light: 'oklch(0.52 0.28 295 / 0.07)', accent: 'oklch(0.52 0.28 295)' },
];

const DAY_EMOJIS = ['🌅', '⚡', '🔥', '💡', '🚀', '🎯', '🏆'];

const DAY_THEMES = [
  'Introduction & Setup',
  'Core Concept A',
  'Core Concept B',
  'Applied Practice',
  'Intermediate Application',
  'Project & Review',
  'Final Deliverable',
];

function DayCard({ day, dayNumber, animationDelay = 0 }: DayCardProps) {
  const idx = (dayNumber - 1) % DAY_GRADIENTS.length;
  const colorScheme = DAY_GRADIENTS[idx];
  const emoji = DAY_EMOJIS[idx];
  const theme = DAY_THEMES[idx];

  return (
    <div
      className="rounded-3xl border-2 overflow-hidden card-shadow-md animate-slide-up animate-fill-both"
      style={{
        borderColor: colorScheme.border,
        background: 'white',
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: colorScheme.header }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl">
            {emoji}
          </div>
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Day {dayNumber}</p>
            <p className="text-white font-display font-extrabold text-lg leading-tight">{theme}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 backdrop-blur-sm">
          <Clock className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-xs font-bold">{formatEstimatedTime(day.estimatedTime)}</span>
        </div>
      </div>

      <div className="p-5 space-y-3.5">
        <DayField icon="🎯" label={`Day ${dayNumber} Objective`} value={day.objectives} bgColor={colorScheme.light} />
        <DayField icon="⚡" label="Action Task" value={day.actionTask} bgColor="oklch(0.85 0.2 90 / 0.08)" />
        <DayField icon="💪" label="Practice Exercise" value={day.practiceExercise} bgColor="oklch(0.78 0.22 140 / 0.08)" />
        <DayField icon="📦" label="Deliverable" value={day.deliverable} bgColor="oklch(0.72 0.18 200 / 0.08)" />
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
  const idx = (dayNumber - 1) % DAY_GRADIENTS.length;
  const colorScheme = DAY_GRADIENTS[idx];
  const emoji = DAY_EMOJIS[idx];
  const theme = DAY_THEMES[idx];

  return (
    <div
      className="rounded-3xl border-2 overflow-hidden card-shadow relative animate-slide-up animate-fill-both"
      style={{ borderColor: colorScheme.border, background: 'white', animationDelay: `${animationDelay}ms` }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px] z-10 flex items-center justify-center rounded-3xl">
        <div className="flex flex-col items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: colorScheme.header }}>
            <Lock className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ background: colorScheme.header }}>
            🔒 Unlock to view Day {dayNumber}
          </span>
        </div>
      </div>
      <div className="px-5 py-4 flex items-center gap-3" style={{ background: colorScheme.header }}>
        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl">{emoji}</div>
        <div>
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Day {dayNumber}</p>
          <p className="text-white font-display font-extrabold text-lg">{theme}</p>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {[1, 2, 3, 4].map((i) => (
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

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function PlanResults() {
  const { planId } = useParams({ from: '/plan/$planId' });
  const navigate = useNavigate();

  // completedDays is updated via the ProgressTracker's onCompletedDaysChange callback
  const [completedDays, setCompletedDays] = useState<boolean[]>(Array(7).fill(false));

  // Only use the public plan view — Days 2-7 are always locked
  const publicQuery = useGetPublicPlanView(planId);
  const publicView = publicQuery.data;
  const isLoading = publicQuery.isLoading;

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

  if (!publicView) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
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

  const skillName = publicView.skillName;
  const skillLevel = publicView.skillLevel;
  const hoursPerDay = Number(publicView.hoursPerDay);
  const desiredOutcome = publicView.desiredOutcome;
  const skillOverview = publicView.skillOverview;
  const endOfWeekResult = publicView.endOfWeekResult;
  const commonMistakes = publicView.commonMistakes;

  // Sanitize bonus resource URL on the frontend
  const bonusResource = getReliableBonusResource(publicView.skillName, publicView.bonusResource);

  // Day 1 is always visible; Days 2-7 are always locked
  const allDays: (DayPlan | null)[] = [
    (publicView as PublicPlanView)?.firstDay ?? null,
    null, null, null, null, null, null,
  ];

  const levelEmoji: Record<string, string> = {
    Beginner: '🌱',
    Intermediate: '⚡',
    Advanced: '🔥',
  };

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Back bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap animate-slide-in-left delay-0 animate-fill-both">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-2xl hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
          New Sprint
        </button>
      </div>

      {/* Hero Card */}
      <div
        className="rounded-3xl p-6 text-white card-shadow-md overflow-hidden relative animate-slide-up delay-100 animate-fill-both"
        style={{ background: 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.62 0.28 350), oklch(0.72 0.18 200))' }}
      >
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
            <div className="flex flex-col items-end gap-2">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: 'oklch(1 0 0 / 0.2)', border: '1px solid oklch(1 0 0 / 0.3)' }}
              >
                {levelEmoji[skillLevel] ?? '⚡'} {skillLevel}
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: 'oklch(1 0 0 / 0.2)', border: '1px solid oklch(1 0 0 / 0.3)' }}
              >
                ⏱ {hoursPerDay}h/day
              </span>
            </div>
          </div>

          <div
            className="rounded-2xl p-3 mb-4"
            style={{ background: 'oklch(1 0 0 / 0.12)', border: '1px solid oklch(1 0 0 / 0.2)' }}
          >
            <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">🎯 Goal</p>
            <p className="text-white text-sm font-medium leading-relaxed">{desiredOutcome}</p>
          </div>

          <div
            className="rounded-2xl p-3"
            style={{ background: 'oklch(1 0 0 / 0.12)', border: '1px solid oklch(1 0 0 / 0.2)' }}
          >
            <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">📖 Overview</p>
            <p className="text-white text-sm font-medium leading-relaxed">{skillOverview}</p>
          </div>
        </div>
      </div>

      {/* Progress Tracker — ProgressTracker manages its own completed state internally */}
      <div className="animate-slide-up delay-200 animate-fill-both">
        <ProgressTracker
          totalDays={7}
          unlockedDays={1}
          onCompletedDaysChange={setCompletedDays}
        />
      </div>

      {/* Progress Graph */}
      <div className="animate-slide-up delay-300 animate-fill-both">
        <ProgressGraph completedDays={completedDays} />
      </div>

      {/* Day Cards */}
      <div>
        <h2 className="font-display font-extrabold text-xl text-foreground mb-4 flex items-center gap-2">
          📅 Your 7-Day Plan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {allDays.map((day, index) => {
            const dayNumber = index + 1;
            if (day) {
              return (
                <DayCard
                  key={dayNumber}
                  day={day}
                  dayNumber={dayNumber}
                  animationDelay={index * 80}
                />
              );
            }
            return (
              <LockedDayCard
                key={dayNumber}
                dayNumber={dayNumber}
                animationDelay={index * 80}
              />
            );
          })}
        </div>
      </div>

      {/* Paywall Section — always shown */}
      <div className="animate-slide-up delay-400 animate-fill-both">
        <PaywallModal planId={planId} />
      </div>

      {/* End of Week Result — locked */}
      <div
        className="rounded-3xl p-6 relative overflow-hidden animate-slide-up delay-500 animate-fill-both"
        style={{
          background: 'linear-gradient(135deg, oklch(0.72 0.22 50 / 0.08), oklch(0.85 0.2 90 / 0.06))',
          border: '2px solid oklch(0.72 0.22 50 / 0.2)',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl"
          style={{ background: 'oklch(0.98 0.01 265 / 0.7)' }}
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, oklch(0.72 0.22 50), oklch(0.85 0.2 90))' }}
            >
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.72 0.22 50), oklch(0.85 0.2 90))' }}
            >
              🔒 Pay to unlock
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, oklch(0.72 0.22 50), oklch(0.85 0.2 90))' }}
          >
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-display font-extrabold text-xl text-foreground">End of Week Result</h2>
        </div>
        <div
          className="rounded-2xl p-4"
          style={{ background: 'oklch(0.72 0.22 50 / 0.08)', border: '1px solid oklch(0.72 0.22 50 / 0.2)' }}
        >
          <p className="text-sm text-foreground leading-relaxed font-medium">{endOfWeekResult}</p>
        </div>
      </div>

      {/* Common Mistakes — locked */}
      <div
        className="rounded-3xl p-6 relative overflow-hidden animate-slide-up delay-500 animate-fill-both"
        style={{
          background: 'linear-gradient(135deg, oklch(0.62 0.28 350 / 0.06), oklch(0.52 0.28 295 / 0.04))',
          border: '2px solid oklch(0.62 0.28 350 / 0.2)',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl"
          style={{ background: 'oklch(0.98 0.01 265 / 0.7)' }}
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, oklch(0.62 0.28 350), oklch(0.52 0.28 295))' }}
            >
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.62 0.28 350), oklch(0.52 0.28 295))' }}
            >
              🔒 Pay to unlock
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, oklch(0.62 0.28 350), oklch(0.52 0.28 295))' }}
          >
            <Star className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-display font-extrabold text-xl text-foreground">Common Mistakes to Avoid</h2>
        </div>
        <div className="space-y-2">
          {commonMistakes.map((mistake, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl p-3"
              style={{ background: 'oklch(0.62 0.28 350 / 0.06)', border: '1px solid oklch(0.62 0.28 350 / 0.15)' }}
            >
              <span className="text-base flex-shrink-0">⚠️</span>
              <p className="text-sm text-foreground font-medium leading-relaxed">{mistake}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bonus Resource — locked */}
      <div
        className="rounded-3xl p-6 relative overflow-hidden animate-slide-up delay-600 animate-fill-both"
        style={{
          background: 'linear-gradient(135deg, oklch(0.72 0.18 200 / 0.08), oklch(0.52 0.28 295 / 0.06))',
          border: '2px solid oklch(0.72 0.18 200 / 0.25)',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl"
          style={{ background: 'oklch(0.98 0.01 265 / 0.7)' }}
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 200), oklch(0.52 0.28 295))' }}
            >
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 200), oklch(0.52 0.28 295))' }}
            >
              🔒 Pay to unlock
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 200), oklch(0.52 0.28 295))' }}
          >
            <ExternalLink className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-display font-extrabold text-xl text-foreground">🎁 Bonus Resource</h2>
        </div>
        <div
          className="rounded-2xl p-4 flex items-center justify-between gap-3"
          style={{ background: 'oklch(0.72 0.18 200 / 0.08)', border: '1px solid oklch(0.72 0.18 200 / 0.2)' }}
        >
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Recommended Resource
            </p>
            <p className="text-sm font-semibold text-foreground">{bonusResource.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate max-w-xs">
              {bonusResource.url}
            </p>
          </div>
          <ExternalLink className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
