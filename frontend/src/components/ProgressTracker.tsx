import React, { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProgressTrackerProps {
  totalDays?: number;
  unlockedDays?: number;
}

export default function ProgressTracker({ totalDays = 7, unlockedDays = 1 }: ProgressTrackerProps) {
  const [completed, setCompleted] = useState<boolean[]>(Array(totalDays).fill(false));

  const completedCount = completed.filter(Boolean).length;
  const percentage = Math.round((completedCount / totalDays) * 100);

  const toggleDay = (index: number) => {
    if (index >= unlockedDays) return; // Can't check locked days
    setCompleted((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <div className="bg-card rounded-2xl border border-border card-shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-foreground text-base">Your Progress</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completedCount} of {totalDays} days completed
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-display font-bold text-blue-600">{percentage}%</span>
        </div>
      </div>

      <Progress
        value={percentage}
        className="h-2.5 mb-4 bg-blue-100"
      />

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: totalDays }, (_, i) => {
          const isLocked = i >= unlockedDays;
          const isDone = completed[i];

          return (
            <button
              key={i}
              onClick={() => toggleDay(i)}
              disabled={isLocked}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200
                ${isLocked
                  ? 'opacity-40 cursor-not-allowed'
                  : isDone
                    ? 'bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100'
                    : 'bg-secondary border border-border cursor-pointer hover:bg-accent'
                }
              `}
              title={isLocked ? 'Unlock to track' : `Day ${i + 1}`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              ) : (
                <Circle className={`w-4 h-4 ${isLocked ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
              )}
              <span className={`text-xs font-medium ${isDone ? 'text-blue-700' : 'text-muted-foreground'}`}>
                D{i + 1}
              </span>
            </button>
          );
        })}
      </div>

      {completedCount === totalDays && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
          <p className="text-sm font-semibold text-blue-700">🎉 Sprint Complete! You did it!</p>
        </div>
      )}
    </div>
  );
}
