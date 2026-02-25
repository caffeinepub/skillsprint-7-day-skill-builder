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
      <header className="bg-card border-b border-border sticky top-0 z-40 card-shadow">
        <div className="max-w-content mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/generated/skillsprint-logo.dim_128x128.png"
              alt="SkillSprint Logo"
              className="w-9 h-9 rounded-xl"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-display font-700 text-base text-foreground tracking-tight">
                SkillSprint
              </span>
              <span className="text-xs text-muted-foreground font-medium">7 Day Skill Builder</span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              AI-Powered Plans
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
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
            <span className="text-red-500">♥</span>
            {' '}using{' '}
            <span className="font-semibold text-blue-600">caffeine.ai</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
