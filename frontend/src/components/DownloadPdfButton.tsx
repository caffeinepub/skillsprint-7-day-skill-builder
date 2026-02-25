import React from 'react';
import { Download } from 'lucide-react';
import type { SprintPlan } from '../backend';

interface DownloadPdfButtonProps {
  plan: SprintPlan;
}

export default function DownloadPdfButton({ plan }: DownloadPdfButtonProps) {
  const handleDownload = () => {
    const printContent = buildPrintContent(plan);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download the PDF.');
      return;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all duration-200 hover:scale-105"
      style={{
        background: 'linear-gradient(135deg, oklch(0.52 0.28 295 / 0.08), oklch(0.62 0.28 350 / 0.06))',
        borderColor: 'oklch(0.52 0.28 295 / 0.3)',
        color: 'oklch(0.42 0.28 295)',
      }}
    >
      <Download className="w-4 h-4" />
      📥 Download PDF
    </button>
  );
}

function buildPrintContent(plan: SprintPlan): string {
  const days = plan.days.map((day, i) => {
    const resources = day.resources && day.resources.length > 0
      ? `<div class="resources"><strong>📚 Study Resources:</strong><ul>${day.resources.map(r => `<li><a href="${r.url}" target="_blank">${r.title}</a> — ${r.description}</li>`).join('')}</ul></div>`
      : '';
    return `
    <div class="day-card">
      <div class="day-header">Day ${i + 1}</div>
      <table>
        <tr><td class="label">🎯 Objective</td><td>${day.objectives}</td></tr>
        <tr><td class="label">⚡ Action Task</td><td>${day.actionTask}</td></tr>
        <tr><td class="label">💪 Practice Exercise</td><td>${day.practiceExercise}</td></tr>
        <tr><td class="label">📦 Deliverable</td><td>${day.deliverable}</td></tr>
        <tr><td class="label">⏰ Estimated Time</td><td>${Number(day.estimatedTime)} hour(s)</td></tr>
      </table>
      ${resources}
    </div>
  `;
  }).join('');

  const mistakes = plan.commonMistakes.map((m) => `<li>${m}</li>`).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>SkillSprint – ${plan.skillName} Plan</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; padding: 32px; font-size: 13px; line-height: 1.6; }
        h1 { font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #7c3aed, #db2777); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 4px; }
        h2 { font-size: 16px; font-weight: 700; color: #4c1d95; margin: 20px 0 8px; border-bottom: 2px solid #e9d5ff; padding-bottom: 4px; }
        .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 20px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
        .meta-item { background: linear-gradient(135deg, #f5f3ff, #fdf2f8); border: 1px solid #e9d5ff; border-radius: 12px; padding: 8px 12px; }
        .meta-item .key { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .meta-item .val { font-weight: 700; color: #4c1d95; font-size: 13px; }
        .overview { background: linear-gradient(135deg, #f0f9ff, #fdf4ff); border: 1px solid #c4b5fd; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; }
        .day-card { border: 2px solid #e9d5ff; border-radius: 12px; margin-bottom: 12px; overflow: hidden; }
        .day-header { background: linear-gradient(135deg, #7c3aed, #db2777); color: white; font-weight: 800; padding: 8px 14px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 7px 14px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
        td.label { font-weight: 700; color: #4c1d95; width: 160px; background: #faf5ff; font-size: 11px; }
        .resources { padding: 10px 14px; background: #f0fdf4; border-top: 1px solid #d1fae5; }
        .resources ul { padding-left: 16px; margin-top: 4px; }
        .resources li { margin-bottom: 3px; font-size: 12px; color: #374151; }
        .resources a { color: #7c3aed; }
        .result-box { background: linear-gradient(135deg, #fefce8, #fff7ed); border: 1px solid #fde68a; border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; }
        .mistakes-list { padding-left: 20px; }
        .mistakes-list li { margin-bottom: 4px; color: #db2777; font-weight: 500; }
        .bonus { background: linear-gradient(135deg, #f0f9ff, #f5f3ff); border: 1px solid #c4b5fd; border-radius: 12px; padding: 12px 16px; }
        .bonus a { color: #7c3aed; font-weight: 600; }
        .footer { margin-top: 32px; padding-top: 12px; border-top: 2px solid #e9d5ff; color: #9ca3af; font-size: 11px; text-align: center; }
        @media print { body { padding: 16px; } }
      </style>
    </head>
    <body>
      <h1>🚀 SkillSprint – ${plan.skillName}</h1>
      <p class="subtitle">7-Day Skill Building Plan · Generated by SkillSprint</p>

      <div class="meta-grid">
        <div class="meta-item"><div class="key">Skill Level</div><div class="val">${plan.skillLevel}</div></div>
        <div class="meta-item"><div class="key">Hours / Day</div><div class="val">${Number(plan.hoursPerDay)} hrs</div></div>
        <div class="meta-item" style="grid-column: span 2"><div class="key">Desired Outcome</div><div class="val">${plan.desiredOutcome}</div></div>
      </div>

      <h2>📖 Skill Overview</h2>
      <div class="overview">${plan.skillOverview}</div>

      <h2>📅 7-Day Plan</h2>
      ${days}

      <h2>🏆 End of Week Result</h2>
      <div class="result-box">${plan.endOfWeekResult}</div>

      <h2>⚠️ Common Mistakes to Avoid</h2>
      <ul class="mistakes-list">
        ${mistakes}
      </ul>

      <h2>🎁 Bonus Resource</h2>
      <div class="bonus">
        <strong>${plan.bonusResource.title}</strong><br/>
        <a href="${plan.bonusResource.url}" target="_blank">${plan.bonusResource.url}</a>
      </div>

      <div class="footer">Generated by 🚀 SkillSprint · caffeine.ai</div>
    </body>
    </html>
  `;
}
