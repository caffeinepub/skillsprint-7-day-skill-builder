import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Zap, ChevronDown, Loader2, Target, Clock, BarChart3, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePlan } from '@/hooks/useQueries';

const PRESET_SKILLS = [
  'Python Programming',
  'Public Speaking',
  'UI/UX Design',
  'Microsoft Excel',
  'Photography',
  'Creative Writing',
  'Digital Marketing',
  'Data Analysis',
  'Video Editing',
  'Graphic Design',
  'Custom',
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;
type SkillLevel = typeof SKILL_LEVELS[number];

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
    hoursPerDay >= 0.5 &&
    skillLevel !== '' &&
    desiredOutcome.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValid) {
      setError('Please fill in all fields before generating your sprint.');
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

  const levelColors: Record<SkillLevel, string> = {
    Beginner: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    Intermediate: 'bg-amber-50 border-amber-200 text-amber-700',
    Advanced: 'bg-red-50 border-red-200 text-red-700',
  };

  const levelActiveColors: Record<SkillLevel, string> = {
    Beginner: 'bg-emerald-500 border-emerald-500 text-white shadow-sm',
    Intermediate: 'bg-amber-500 border-amber-500 text-white shadow-sm',
    Advanced: 'bg-red-500 border-red-500 text-white shadow-sm',
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero section */}
      <div className="bg-gradient-to-b from-blue-50 to-background border-b border-border">
        <div className="max-w-content mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-blue-200">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered 7-Day Plans
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 leading-tight">
            Master Any Skill in{' '}
            <span className="text-blue-600">7 Days</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Get a structured, actionable execution plan tailored to your skill level and goals. No fluff — just daily tasks, exercises, and deliverables.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
            {[
              { icon: BookOpen, label: '10+ Skills', sub: 'to choose from' },
              { icon: Target, label: '7 Days', sub: 'structured plan' },
              { icon: BarChart3, label: 'Personalized', sub: 'to your level' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground text-xs">{label}</div>
                  <div className="text-muted-foreground text-xs">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-content mx-auto px-4 sm:px-6 py-10">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl border border-border card-shadow-md p-6 sm:p-8 space-y-7">
            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-1">Build Your Sprint</h2>
              <p className="text-sm text-muted-foreground">Fill in the details below to generate your personalized plan.</p>
            </div>

            {/* Skill selector */}
            <div className="space-y-2">
              <Label htmlFor="skill-select" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Select a Skill
              </Label>
              <div className="relative">
                <select
                  id="skill-select"
                  value={selectedSkill}
                  onChange={(e) => {
                    setSelectedSkill(e.target.value);
                    if (e.target.value !== 'Custom') setCustomSkill('');
                  }}
                  className="w-full appearance-none bg-background border border-input rounded-xl px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all cursor-pointer"
                >
                  <option value="" disabled>Choose a skill to learn…</option>
                  {PRESET_SKILLS.map((skill) => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {isCustom && (
                <div className="animate-fade-in">
                  <Input
                    type="text"
                    placeholder="Enter your custom skill (e.g. Watercolor Painting)"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    className="rounded-xl border-blue-200 focus-visible:ring-blue-500 mt-2"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Hours per day slider */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                Hours per Day
                <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">
                  {hoursPerDay} {hoursPerDay === 1 ? 'hour' : 'hours'}
                </span>
              </Label>
              <div className="px-1">
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, oklch(0.55 0.22 264) 0%, oklch(0.55 0.22 264) ${((hoursPerDay - 1) / 7) * 100}%, oklch(0.9 0.015 240) ${((hoursPerDay - 1) / 7) * 100}%, oklch(0.9 0.015 240) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5 px-0.5">
                  <span>1 hr</span>
                  <span>2 hrs</span>
                  <span>3 hrs</span>
                  <span>4 hrs</span>
                  <span>5 hrs</span>
                  <span>6 hrs</span>
                  <span>7 hrs</span>
                  <span>8 hrs</span>
                </div>
              </div>
            </div>

            {/* Skill level */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                Skill Level
              </Label>
              <div className="grid grid-cols-3 gap-2.5">
                {SKILL_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSkillLevel(level)}
                    className={`
                      py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200
                      ${skillLevel === level
                        ? levelActiveColors[level]
                        : `${levelColors[level]} hover:opacity-80`
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Desired outcome */}
            <div className="space-y-2">
              <Label htmlFor="outcome" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Target className="w-4 h-4 text-blue-500" />
                Desired Outcome
              </Label>
              <Textarea
                id="outcome"
                placeholder="What do you want to achieve by Day 7? (e.g. Build a working Python script that automates my daily tasks)"
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                className="rounded-xl resize-none min-h-[90px] border-input focus-visible:ring-blue-500 text-sm"
                rows={3}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 animate-fade-in">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={!isValid || createPlan.isPending}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-base rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {createPlan.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Your Sprint…
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Generate My Sprint
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Day 1 is free to preview. Unlock all 7 days for just ₹20.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
