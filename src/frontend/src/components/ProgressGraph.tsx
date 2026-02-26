import React from 'react';

interface ProgressGraphProps {
  completedDays: boolean[];
}

const DAY_COLORS = [
  { fill: 'oklch(0.52 0.28 295)', light: 'oklch(0.52 0.28 295 / 0.15)' },   // purple
  { fill: 'oklch(0.62 0.28 350)', light: 'oklch(0.62 0.28 350 / 0.15)' },   // pink
  { fill: 'oklch(0.72 0.18 200)', light: 'oklch(0.72 0.18 200 / 0.15)' },   // cyan
  { fill: 'oklch(0.78 0.22 140)', light: 'oklch(0.78 0.22 140 / 0.15)' },   // lime
  { fill: 'oklch(0.72 0.22 50)',  light: 'oklch(0.72 0.22 50 / 0.15)' },    // orange
  { fill: 'oklch(0.65 0.28 295)', light: 'oklch(0.65 0.28 295 / 0.15)' },   // violet
  { fill: 'oklch(0.68 0.18 200)', light: 'oklch(0.68 0.18 200 / 0.15)' },   // teal
];

export default function ProgressGraph({ completedDays }: ProgressGraphProps) {
  const totalDays = 7;
  const completedCount = completedDays.filter(Boolean).length;

  // SVG dimensions
  const svgWidth = 560;
  const svgHeight = 180;
  const paddingLeft = 40;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 40;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const barWidth = (chartWidth / totalDays) * 0.55;
  const barGap = (chartWidth / totalDays) * 0.45;

  const yLabels = [0, 25, 50, 75, 100];

  return (
    <div className="rounded-3xl border-2 overflow-hidden card-shadow-md animate-slide-up"
      style={{ borderColor: 'oklch(0.72 0.18 200 / 0.3)', background: 'white' }}
    >
      <div className="p-5 pb-2" style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 200 / 0.07), oklch(0.52 0.28 295 / 0.05))' }}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <h3 className="font-display font-bold text-lg" style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 200), oklch(0.52 0.28 295))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            📊 Your Sprint Progress
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'oklch(0.72 0.18 200 / 0.15)', color: 'oklch(0.45 0.18 200)' }}
            >
              {completedCount}/{totalDays} days ✅
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Mark days complete above to see your progress fill up! 🚀</p>
      </div>

      <div className="px-4 pb-4 pt-2">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full"
            style={{ minWidth: '280px', maxHeight: '200px' }}
            aria-label="Sprint progress bar chart"
          >
            {/* Grid lines */}
            {yLabels.map((label) => {
              const y = paddingTop + chartHeight - (label / 100) * chartHeight;
              return (
                <g key={label}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="oklch(0.88 0.018 280)"
                    strokeWidth="1"
                    strokeDasharray={label === 0 ? 'none' : '4 4'}
                  />
                  <text
                    x={paddingLeft - 6}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="oklch(0.5 0.03 280)"
                    fontFamily="Space Grotesk, sans-serif"
                  >
                    {label}%
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {Array.from({ length: totalDays }, (_, i) => {
              const isDone = completedDays[i] ?? false;
              const barHeight = isDone ? chartHeight : 8;
              const x = paddingLeft + i * (barWidth + barGap) + barGap / 2;
              const y = paddingTop + chartHeight - barHeight;
              const color = DAY_COLORS[i % DAY_COLORS.length];
              const gradId = `bar-grad-${i}`;

              return (
                <g key={i}>
                  {/* Define gradient */}
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isDone ? color.fill : 'oklch(0.88 0.018 280)'} stopOpacity="1" />
                      <stop offset="100%" stopColor={isDone ? color.fill : 'oklch(0.92 0.012 280)'} stopOpacity={isDone ? '0.7' : '1'} />
                    </linearGradient>
                  </defs>

                  {/* Background bar (empty) */}
                  <rect
                    x={x}
                    y={paddingTop}
                    width={barWidth}
                    height={chartHeight}
                    rx="6"
                    fill={color.light}
                  />

                  {/* Filled bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="6"
                    fill={`url(#${gradId})`}
                    style={{
                      transition: 'height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), y 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  />

                  {/* Glow effect for completed */}
                  {isDone && (
                    <rect
                      x={x - 2}
                      y={y - 2}
                      width={barWidth + 4}
                      height={barHeight + 4}
                      rx="8"
                      fill="none"
                      stroke={color.fill}
                      strokeWidth="2"
                      strokeOpacity="0.4"
                    />
                  )}

                  {/* Day label */}
                  <text
                    x={x + barWidth / 2}
                    y={svgHeight - paddingBottom + 16}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={isDone ? color.fill : 'oklch(0.5 0.03 280)'}
                    fontFamily="Space Grotesk, sans-serif"
                  >
                    D{i + 1}
                  </text>

                  {/* Checkmark for completed */}
                  {isDone && (
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize="12"
                    >
                      ✅
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-1 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.62 0.28 350))' }} />
            <span className="text-xs text-muted-foreground font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-secondary border border-border" />
            <span className="text-xs text-muted-foreground font-medium">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}
