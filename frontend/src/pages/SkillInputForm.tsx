import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Zap, Loader2, Target, Clock, BarChart3, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePlan } from '@/hooks/useQueries';

const PRESET_SKILLS = [
  { label: '🐍 Python Programming', value: 'Python Programming' },
  { label: '🎤 Public Speaking', value: 'Public Speaking' },
  { label: '🎨 UI/UX Design', value: 'UI/UX Design' },
  { label: '📊 Microsoft Excel', value: 'Microsoft Excel' },
  { label: '📸 Photography', value: 'Photography' },
  { label: '✍️ Creative Writing', value: 'Creative Writing' },
  { label: '📱 Digital Marketing', value: 'Digital Marketing' },
  { label: '📈 Data Analysis', value: 'Data Analysis' },
  { label: '🎬 Video Editing', value: 'Video Editing' },
  { label: '🖌️ Graphic Design', value: 'Graphic Design' },
  { label: '✨ Custom', value: 'Custom' },
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;
type SkillLevel = typeof SKILL_LEVELS[number];

const LEVEL_CONFIG: Record<SkillLevel, { emoji: string; desc: string; gradient: string; border: string; text: string }> = {
  Beginner: {
    emoji: '🌱',
    desc: 'Just starting out',
    gradient: 'linear-gradient(135deg, oklch(0.78 0.22 140 / 0.15), oklch(0.72 0.18 200 / 0.1))',
    border: 'oklch(0.78 0.22 140 / 0.5)',
    text: 'oklch(0.45 0.22 140)',
  },
  Intermediate: {
    emoji: '⚡',
    desc: 'Some experience',
    gradient: 'linear-gradient(135deg, oklch(0.85 0.2 90 / 0.15), oklch(0.72 0.22 50 / 0.1))',
    border: 'oklch(0.72 0.22 50 / 0.5)',
    text: 'oklch(0.5 0.22 50)',
  },
  Advanced: {
    emoji: '🔥',
    desc: 'Ready to level up',
    gradient: 'linear-gradient(135deg, oklch(0.62 0.28 350 / 0.15), oklch(0.52 0.28 295 / 0.1))',
    border: 'oklch(0.62 0.28 350 / 0.5)',
    text: 'oklch(0.45 0.28 350)',
  },
};

export default function SkillInputForm() {
  const navigate = useNavigate();
  const createPlan = useCreatePlan();

  const [selectedSkill, setSelectedSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [skillLevel, setSkillLevel] = useState<SkillLevel | ''>('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [error, setError] = useState('');

  const isCustom = selectedSkill === 'Custom';
  const effectiveSkill = isCustom ? customSkill.trim() : selectedSkill;

  const isValid =
    effectiveSkill.length > 0 &&
    hoursPerDay >= 1 &&
    skillLevel !== '' &&
    desiredOutcome.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValid) {
      setError('Fill in all fields to generate your sprint! 🚀');
      return;
    }

    try {
      const planId = await createPlan.mutateAsync({
        skillName: effectiveSkill,
        hoursPerDay: Math.round(hoursPerDay),
        level: skillLevel as string,
        outcome: desiredOutcome.trim(),
      });
      navigate({ to: '/plan/$planId', params: { planId: planId.toString() } });
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
    }
  };

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero section */}
      <div className="text-center mb-10 animate-slide-up delay-0 animate-fill-both">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 animate-bounce-in delay-100 animate-fill-both"
          style={{ background: 'linear-gradient(135deg, oklch(0.52 0.28 295 / 0.12), oklch(0.62 0.28 350 / 0.1))', border: '1.5px solid oklch(0.52 0.28 295 / 0.3)', color: 'oklch(0.42 0.28 295)' }}
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered 7-Day Sprint Plans
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-tight mb-3">
          <span className="gradient-text-rainbow">Level Up</span>
          <br />
          <span className="text-foreground">Any Skill in 7 Days</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          Get a personalized, day-by-day action plan tailored to your goals. No fluff, just results. 🎯
        </p>
      </div>

      {/* Form card */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-3xl border-2 overflow-hidden card-shadow-md"
          style={{ borderColor: 'oklch(0.52 0.28 295 / 0.2)', background: 'white' }}
        >
          {/* Form header */}
          <div className="p-6 pb-5" style={{ background: 'linear-gradient(135deg, oklch(0.52 0.28 295 / 0.08), oklch(0.62 0.28 350 / 0.05))' }}>
            <h2 className="font-display font-bold text-xl text-foreground">
              🎯 Build Your Sprint Plan
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Answer 4 quick questions and we'll do the rest ✨</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Step 1: Skill */}
            <div className="animate-slide-in-left delay-100 animate-fill-both">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.62 0.28 350))' }}
                >1</div>
                <Label className="text-base font-bold text-foreground">🎓 Choose Your Skill</Label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_SKILLS.map((skill) => {
                  const isSelected = selectedSkill === skill.value;
                  return (
                    <button
                      key={skill.value}
                      type="button"
                      onClick={() => setSelectedSkill(skill.value)}
                      className="px-3 py-2.5 rounded-2xl text-sm font-semibold text-left transition-all duration-200 border-2"
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, oklch(0.52 0.28 295 / 0.12), oklch(0.62 0.28 350 / 0.1))'
                          : 'white',
                        borderColor: isSelected ? 'oklch(0.52 0.28 295 / 0.6)' : 'oklch(0.88 0.018 280)',
                        color: isSelected ? 'oklch(0.42 0.28 295)' : 'oklch(0.35 0.025 280)',
                        transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                        boxShadow: isSelected ? '0 4px 12px oklch(0.52 0.28 295 / 0.2)' : 'none',
                      }}
                    >
                      {skill.label}
                    </button>
                  );
                })}
              </div>

              {isCustom && (
                <div className="mt-3 animate-fade-in">
                  <Input
                    placeholder="e.g. Watercolor Painting, Chess, Cooking..."
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    className="rounded-2xl border-2 font-medium"
                    style={{ borderColor: 'oklch(0.52 0.28 295 / 0.3)' }}
                  />
                </div>
              )}
            </div>

            {/* Step 2: Hours */}
            <div className="animate-slide-in-right delay-200 animate-fill-both">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 200), oklch(0.52 0.28 295))' }}
                >2</div>
                <Label className="text-base font-bold text-foreground">⏰ Hours Per Day</Label>
              </div>
              <div className="rounded-2xl p-5 border-2"
                style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 200 / 0.07), oklch(0.52 0.28 295 / 0.05))', borderColor: 'oklch(0.72 0.18 200 / 0.3)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground font-medium">Daily commitment</span>
                  <span className="text-2xl font-display font-extrabold"
                    style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 200), oklch(0.52 0.28 295))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                  >
                    {hoursPerDay}h / day
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                    <span key={h} className={`text-xs font-bold ${hoursPerDay === h ? 'gradient-text-purple' : 'text-muted-foreground'}`}>
                      {h}h
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Level */}
            <div className="animate-slide-in-left delay-300 animate-fill-both">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, oklch(0.78 0.22 140), oklch(0.72 0.18 200))' }}
                >3</div>
                <Label className="text-base font-bold text-foreground">📊 Your Current Level</Label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {SKILL_LEVELS.map((level) => {
                  const config = LEVEL_CONFIG[level];
                  const isSelected = skillLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSkillLevel(level)}
                      className="flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all duration-200 font-semibold"
                      style={{
                        background: isSelected ? config.gradient : 'white',
                        borderColor: isSelected ? config.border : 'oklch(0.88 0.018 280)',
                        color: isSelected ? config.text : 'oklch(0.5 0.03 280)',
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: isSelected ? `0 4px 16px ${config.border}` : 'none',
                      }}
                    >
                      <span className="text-2xl">{config.emoji}</span>
                      <span className="text-sm font-bold">{level}</span>
                      <span className="text-xs opacity-70">{config.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Outcome */}
            <div className="animate-slide-in-right delay-400 animate-fill-both">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, oklch(0.72 0.22 50), oklch(0.62 0.28 350))' }}
                >4</div>
                <Label className="text-base font-bold text-foreground">🏆 Your Desired Outcome</Label>
              </div>
              <Textarea
                placeholder="e.g. I want to build a simple web app, land a freelance gig, or impress my team with data dashboards..."
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                rows={3}
                className="rounded-2xl border-2 font-medium resize-none"
                style={{ borderColor: 'oklch(0.72 0.22 50 / 0.3)' }}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Be specific! The more detail you give, the better your plan. 💡
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-2xl text-sm font-medium animate-fade-in"
                style={{ background: 'oklch(0.62 0.28 350 / 0.1)', border: '1.5px solid oklch(0.62 0.28 350 / 0.3)', color: 'oklch(0.45 0.28 350)' }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <div className="animate-slide-up delay-500 animate-fill-both">
              <button
                type="submit"
                disabled={createPlan.isPending || !isValid}
                className="w-full h-14 rounded-2xl text-white font-display font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: isValid
                    ? 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.62 0.28 350), oklch(0.72 0.18 200))'
                    : 'oklch(0.7 0.02 280)',
                  boxShadow: isValid ? '0 8px 24px oklch(0.52 0.28 295 / 0.4)' : 'none',
                  transform: isValid ? 'translateY(0)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (isValid) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                {createPlan.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Your Sprint...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate My 7-Day Sprint 🚀
                  </>
                )}
              </button>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                {['⚡ Instant Plan', '🎯 Personalized', '📚 Study Resources', '🏆 Gamified'].map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground font-medium">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
