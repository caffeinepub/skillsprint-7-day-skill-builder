import React from 'react';
import { Download } from 'lucide-react';
import type { PublicPlanView } from '../backend';

interface DownloadPdfButtonProps {
  plan: PublicPlanView;
}

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
// Component
// ---------------------------------------------------------------------------

export default function DownloadPdfButton({ plan }: DownloadPdfButtonProps) {
  const bonusResource = getReliableBonusResource(plan.skillName, plan.bonusResource);

  const handleDownload = () => {
    const printContent = buildPrintContent(plan, bonusResource);
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

function buildPrintContent(
  plan: PublicPlanView,
  bonusResource: { title: string; url: string }
): string {
  // PublicPlanView only has firstDay; render it as Day 1 and note Days 2-7 are locked
  const day1 = plan.firstDay;
  const day1Html = `
    <div class="day-card">
      <div class="day-header">Day 1 – Introduction &amp; Setup</div>
      <table>
        <tr><td class="label">🎯 Objective</td><td>${day1.objectives}</td></tr>
        <tr><td class="label">⚡ Action Task</td><td>${day1.actionTask}</td></tr>
        <tr><td class="label">💪 Practice Exercise</td><td>${day1.practiceExercise}</td></tr>
        <tr><td class="label">📦 Deliverable</td><td>${day1.deliverable}</td></tr>
        <tr><td class="label">⏰ Estimated Time</td><td>${Number(day1.estimatedTime)} hour(s)</td></tr>
      </table>
    </div>
    <div class="locked-notice">
      🔒 Days 2–7 are locked. Unlock the full plan to access all 7 days.
    </div>
  `;

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
        .locked-notice { background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 12px 16px; margin-bottom: 12px; color: #92400e; font-weight: 600; font-size: 13px; }
        .result-box { background: linear-gradient(135deg, #fefce8, #fff7ed); border: 1px solid #fde68a; border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; }
        .mistakes-list { padding-left: 20px; }
        .mistakes-list li { margin-bottom: 4px; color: #db2777; font-weight: 500; }
        .bonus { background: linear-gradient(135deg, #f0f9ff, #f5f3ff); border: 1px solid #c4b5fd; border-radius: 12px; padding: 12px 16px; }
        .bonus-title { font-weight: 700; color: #4c1d95; margin-bottom: 6px; }
        .bonus-url { color: #7c3aed; font-size: 12px; word-break: break-all; }
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
      ${day1Html}

      <h2>🏆 End of Week Result</h2>
      <div class="result-box">${plan.endOfWeekResult}</div>

      <h2>⚠️ Common Mistakes to Avoid</h2>
      <ul class="mistakes-list">
        ${mistakes}
      </ul>

      <h2>🎁 Bonus Resource</h2>
      <div class="bonus">
        <div class="bonus-title">${bonusResource.title}</div>
        <div class="bonus-url">${bonusResource.url}</div>
      </div>

      <div class="footer">Generated by 🚀 SkillSprint · caffeine.ai</div>
    </body>
    </html>
  `;
}
