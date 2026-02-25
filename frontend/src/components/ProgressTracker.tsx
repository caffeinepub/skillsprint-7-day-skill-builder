import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, Zap, Flame, Star, Trophy } from 'lucide-react';

interface ProgressTrackerProps {
  totalDays?: number;
  unlockedDays?: number;
  onCompletedDaysChange?: (completed: boolean[]) => void;
}

interface Badge {
  id: string;
  emoji: string;
  label: string;
  description: string;
  color: string;
  imgSrc?: string;
}

const BADGES: Badge[] = [
  {
    id: 'streak',
    emoji: '🔥',
    label: 'On Fire!',
    description: '3 days in a row',
    color: 'from-orange-400 to-red-500',
    imgSrc: '/assets/generated/badge-streak.dim_128x128.png',
  },
  {
    id: 'halfway',
    emoji: '⭐',
    label: 'Half Way!',
    description: '4 days done',
    color: 'from-yellow-400 to-cyan-400',
    imgSrc: '/assets/generated/badge-halfway.dim_128x128.png',
  },
  {
    id: 'complete',
    emoji: '🏆',
    label: 'Sprint Legend!',
    description: 'All 7 days!',
    color: 'from-purple-500 to-pink-500',
    imgSrc: '/assets/generated/badge-trophy.dim_128x128.png',
  },
];

function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    if (target === prevTarget.current) return;
    const start = prevTarget.current;
    const diff = target - start;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else {
        setValue(target);
        prevTarget.current = target;
      }
    };

    requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

export default function ProgressTracker({ totalDays = 7, unlockedDays = 1, onCompletedDaysChange }: ProgressTrackerProps) {
  const [completed, setCompleted] = useState<boolean[]>(Array(totalDays).fill(false));
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [newBadge, setNewBadge] = useState<string | null>(null);

  const completedCount = completed.filter(Boolean).length;
  const percentage = Math.round((completedCount / totalDays) * 100);
  const totalXP = completedCount * 150;
  const displayXP = useCountUp(totalXP);

  // Calculate streak (consecutive from day 1)
  let streak = 0;
  for (let i = 0; i < completed.length; i++) {
    if (completed[i]) streak++;
    else break;
  }

  // Check badge thresholds
  useEffect(() => {
    const newBadges = new Set(earnedBadges);
    let latestNew: string | null = null;

    if (streak >= 3 && !newBadges.has('streak')) {
      newBadges.add('streak');
      latestNew = 'streak';
    }
    if (completedCount >= 4 && !newBadges.has('halfway')) {
      newBadges.add('halfway');
      latestNew = 'halfway';
    }
    if (completedCount >= 7 && !newBadges.has('complete')) {
      newBadges.add('complete');
      latestNew = 'complete';
    }

    if (newBadges.size !== earnedBadges.size) {
      setEarnedBadges(newBadges);
      setNewBadge(latestNew);
      setTimeout(() => setNewBadge(null), 2000);
    }
  }, [completedCount, streak]);

  const toggleDay = (index: number) => {
    if (index >= unlockedDays) return;
    setCompleted((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      onCompletedDaysChange?.(next);
      return next;
    });
  };

  const dayColors = [
    'from-purple-500 to-pink-500',
    'from-pink-500 to-rose-500',
    'from-cyan-500 to-blue-500',
    'from-lime-500 to-emerald-500',
    'from-orange-500 to-amber-500',
    'from-violet-500 to-purple-500',
    'from-teal-500 to-cyan-500',
  ];

  return (
    <div className="rounded-3xl border-2 overflow-hidden card-shadow-md animate-slide-up"
      style={{ borderColor: 'oklch(0.52 0.28 295 / 0.25)', background: 'white' }}
    >
      {/* Header with XP and Streak */}
      <div className="p-5 pb-4" style={{ background: 'linear-gradient(135deg, oklch(0.52 0.28 295 / 0.08), oklch(0.62 0.28 350 / 0.06))' }}>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h3 className="font-display font-bold text-foreground text-lg">🎮 Your Progress</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedCount} of {totalDays} days crushed 💪
            </p>
          </div>

          {/* XP + Streak counters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.62 0.28 350))', color: 'white' }}
            >
              <Zap className="w-4 h-4" />
              <span className="tabular-nums">{displayXP} XP</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, oklch(0.72 0.22 50), oklch(0.62 0.28 350))', color: 'white' }}
              >
                <Flame className="w-4 h-4" />
                <span>{streak} Streak</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-4 rounded-full overflow-hidden bg-secondary">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, oklch(0.52 0.28 295), oklch(0.62 0.28 350), oklch(0.72 0.18 200))',
            }}
          >
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-muted-foreground font-medium">0%</span>
          <span className="text-xs font-bold gradient-text-purple">{percentage}%</span>
          <span className="text-xs text-muted-foreground font-medium">100%</span>
        </div>
      </div>

      {/* Day buttons */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: totalDays }, (_, i) => {
            const isLocked = i >= unlockedDays;
            const isDone = completed[i];
            const gradient = dayColors[i % dayColors.length];

            return (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                disabled={isLocked}
                className={`
                  flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all duration-200 border-2
                  ${isLocked
                    ? 'opacity-35 cursor-not-allowed border-border bg-secondary'
                    : isDone
                      ? `bg-gradient-to-b ${gradient} border-transparent cursor-pointer shadow-md scale-105`
                      : 'bg-white border-border cursor-pointer hover:border-purple-300 hover:scale-105 hover:shadow-md'
                  }
                `}
                title={isLocked ? '🔒 Unlock to track' : `Day ${i + 1}`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <Circle className={`w-4 h-4 ${isLocked ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
                )}
                <span className={`text-xs font-bold ${isDone ? 'text-white' : 'text-muted-foreground'}`}>
                  D{i + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badge shelf */}
      {earnedBadges.size > 0 && (
        <div className="px-5 pb-5">
          <div className="rounded-2xl p-4 border-2"
            style={{ background: 'linear-gradient(135deg, oklch(0.85 0.2 90 / 0.08), oklch(0.52 0.28 295 / 0.06))', borderColor: 'oklch(0.85 0.2 90 / 0.3)' }}
          >
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">🏅 Badges Earned</p>
            <div className="flex items-center gap-3 flex-wrap">
              {BADGES.filter((b) => earnedBadges.has(b.id)).map((badge) => (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center gap-1 ${newBadge === badge.id ? 'badge-bounce' : ''}`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-md relative overflow-hidden`}>
                    <img
                      src={badge.imgSrc}
                      alt={badge.label}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="text-2xl absolute">{badge.emoji}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground text-center leading-tight">{badge.label}</span>
                  <span className="text-xs text-muted-foreground text-center leading-tight">{badge.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New badge notification */}
      {newBadge && (
        <div className="mx-5 mb-5 p-3 rounded-2xl text-center animate-bounce-in"
          style={{ background: 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.62 0.28 350))', color: 'white' }}
        >
          <p className="text-sm font-bold">
            🎉 New Badge Unlocked: {BADGES.find(b => b.id === newBadge)?.label}!
          </p>
        </div>
      )}

      {/* Completion message */}
      {completedCount === totalDays && (
        <div className="mx-5 mb-5 p-4 rounded-2xl text-center animate-bounce-in"
          style={{ background: 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.62 0.28 350), oklch(0.72 0.18 200))', color: 'white' }}
        >
          <p className="text-base font-bold">🎊 SPRINT COMPLETE! You're a legend! 🎊</p>
          <p className="text-sm opacity-90 mt-1">Total XP earned: ⚡ {totalXP} XP</p>
        </div>
      )}
    </div>
  );
}
