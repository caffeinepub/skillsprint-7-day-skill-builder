import React from 'react';
import { useNavigate } from '@tanstack/react-router';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'skillsprint-app');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-xl">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, oklch(0.52 0.28 295 / 0.08) 0%, oklch(0.62 0.28 350 / 0.06) 50%, oklch(0.72 0.18 200 / 0.05) 100%)',
          }}
        />
        <div className="relative max-w-content mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <img
                src="/assets/generated/skillsprint-logo.dim_128x128.png"
                alt="SkillSprint Logo"
                className="w-9 h-9 rounded-xl"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full gradient-bg-purple animate-pulse" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-base gradient-text-purple tracking-tight">
                🚀 SkillSprint
              </span>
              <span className="text-xs text-muted-foreground font-medium">7-Day Skill Builder</span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
              style={{
                background: 'linear-gradient(135deg, oklch(0.52 0.28 295 / 0.1), oklch(0.62 0.28 350 / 0.1))',
                borderColor: 'oklch(0.52 0.28 295 / 0.3)',
                color: 'oklch(0.42 0.28 295)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full gradient-bg-purple animate-pulse" />
              ✨ AI-Powered Plans
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto bg-white/60 backdrop-blur-sm">
        <div className="max-w-content mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/skillsprint-logo.dim_128x128.png"
              alt="SkillSprint"
              className="w-6 h-6 rounded-lg"
            />
            <span className="text-sm text-muted-foreground">
              © {year} SkillSprint. All rights reserved.
            </span>
          </div>
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Built with{' '}
            <span className="text-neon-pink">♥</span>
            {' '}using{' '}
            <span className="font-bold gradient-text-purple">caffeine.ai</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
