import { useState } from "react";
import { useCreatePlan } from "../hooks/useQueries";
import { Zap, Clock, Target, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";

const SKILL_OPTIONS = [
  { id: "public-speaking", label: "Public Speaking", emoji: "🎤" },
  { id: "communication-skills", label: "Communication Skills", emoji: "💬" },
  { id: "interview-preparation", label: "Interview Preparation", emoji: "🎯" },
  { id: "excel-for-business", label: "Excel for Business", emoji: "📊" },
  { id: "powerpoint-presentation", label: "PowerPoint & Presentation Skills", emoji: "📽️" },
  { id: "time-management", label: "Time Management", emoji: "⏰" },
  { id: "personal-branding", label: "Personal Branding", emoji: "✨" },
  { id: "marketing-basics", label: "Marketing Basics", emoji: "📣" },
  { id: "sales-fundamentals", label: "Sales Fundamentals", emoji: "🤝" },
  { id: "business-case-solving", label: "Business Case Solving", emoji: "💡" },
  { id: "bba-dbe-preparation", label: "BBA/DBE Preparation", emoji: "🎓" },
  { id: "productivity-systems", label: "Productivity Systems", emoji: "🚀" },
  { id: "custom", label: "Other", emoji: "🌟" },
];

const LEVEL_OPTIONS = [
  { id: "Beginner", label: "Beginner", emoji: "🌱", desc: "Just starting out" },
  { id: "Intermediate", label: "Intermediate", emoji: "🔥", desc: "Some experience" },
  { id: "Advanced", label: "Advanced", emoji: "⚡", desc: "Ready to level up" },
];

function extractErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong. Please try again.";
  if (error instanceof Error) {
    const msg = error.message;
    // IC canister reject / trap patterns
    if (msg.includes("Reject text:")) {
      const match = msg.match(/Reject text:\s*(.+)/);
      if (match) return match[1].trim();
    }
    if (msg.includes("trapped explicitly")) {
      const match = msg.match(/trapped explicitly[^:]*:\s*(.+)/);
      if (match) return match[1].trim();
    }
    if (msg.includes("Call failed")) {
      return "The request failed. Please check your connection and try again.";
    }
    return msg;
  }
  if (typeof error === "string") return error;
  return "An unexpected error occurred. Please try again.";
}

export default function SkillInputForm() {
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [customSkill, setCustomSkill] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("Beginner");
  const [hoursPerDay, setHoursPerDay] = useState<number>(1);
  const [desiredOutcome, setDesiredOutcome] = useState<string>("");

  const createPlan = useCreatePlan();

  const skillName =
    selectedSkill === "custom" ? customSkill.trim() : selectedSkill;
  const isFormReady =
    skillName.length > 0 &&
    selectedLevel.length > 0 &&
    desiredOutcome.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormReady || createPlan.isPending) return;

    createPlan.reset();
    createPlan.mutate({
      skillName,
      hoursPerDay,
      level: selectedLevel,
      outcome: desiredOutcome.trim(),
    });
  };

  const errorMessage = createPlan.isError
    ? extractErrorMessage(createPlan.error)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-background to-neon-pink/10 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-neon-purple/10 border border-neon-purple/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-neon-purple" />
            <span className="text-sm font-semibold text-neon-purple">7-Day Skill Sprint Generator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-syne mb-4 leading-tight">
            <span className="gradient-text">Level Up</span> Your Skills
            <br />
            <span className="text-foreground">in Just 7 Days</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            Get a personalized daily action plan tailored to your skill level and goals.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-xl p-4">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-destructive mb-1">Plan generation failed</p>
                <p className="text-sm text-destructive/80">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Skill Selection */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
              🎯 Choose Your Skill
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SKILL_OPTIONS.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => setSelectedSkill(skill.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 text-sm font-semibold ${
                    selectedSkill === skill.id
                      ? "border-neon-purple bg-neon-purple/15 text-neon-purple shadow-glow-purple"
                      : "border-border bg-card text-muted-foreground hover:border-neon-purple/50 hover:text-foreground"
                  }`}
                >
                  <span className="text-xl">{skill.emoji}</span>
                  <span className="text-xs">{skill.label}</span>
                </button>
              ))}
            </div>

            {selectedSkill === "custom" && (
              <div className="mt-3">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Enter your skill (e.g. Docker, SQL, Figma...)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-neon-purple/40 bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-purple transition-colors"
                />
              </div>
            )}
          </div>

          {/* Level Selection */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
              📊 Your Current Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {LEVEL_OPTIONS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedLevel === lvl.id
                      ? "border-neon-pink bg-neon-pink/10 text-neon-pink shadow-glow-pink"
                      : "border-border bg-card text-muted-foreground hover:border-neon-pink/50 hover:text-foreground"
                  }`}
                >
                  <span className="text-2xl">{lvl.emoji}</span>
                  <span className="text-sm font-bold">{lvl.label}</span>
                  <span className="text-xs opacity-70">{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hours Per Day */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
              <Clock className="inline w-4 h-4 mr-1" />
              Hours Per Day:{" "}
              <span className="text-neon-cyan font-black text-lg">{hoursPerDay}h</span>
            </label>
            <input
              type="range"
              min={1}
              max={8}
              step={1}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-neon-cyan"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1h</span>
              <span>2h</span>
              <span>3h</span>
              <span>4h</span>
              <span>5h</span>
              <span>6h</span>
              <span>7h</span>
              <span>8h</span>
            </div>
          </div>

          {/* Desired Outcome */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
              <Target className="inline w-4 h-4 mr-1" />
              Your Goal After 7 Days
            </label>
            <textarea
              value={desiredOutcome}
              onChange={(e) => setDesiredOutcome(e.target.value)}
              placeholder="e.g. Build a full-stack web app, pass a coding interview, create a portfolio project..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={createPlan.isPending || !isFormReady}
            className={`w-full py-4 rounded-xl font-black text-lg font-syne transition-all duration-300 flex items-center justify-center gap-3 ${
              isFormReady && !createPlan.isPending
                ? "gradient-bg text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.98]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {createPlan.isPending ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating Your Sprint...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Generate My Sprint</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>

          {!isFormReady && !createPlan.isPending && (
            <p className="text-center text-xs text-muted-foreground">
              Select a skill, level, and enter your goal to continue
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
