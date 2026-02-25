import React, { useState } from 'react';
import {
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  ShieldCheck,
  Copy,
  Check,
  BadgeCheck,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSubmitTransactionId } from '@/hooks/useQueries';

interface PaywallModalProps {
  planId: string;
  onUnlocked: () => void;
}

const UPI_ID = 'nidhi.aesticare@okhdfcbank';
const AMOUNT = '₹20';

const UNLOCK_PERKS = [
  { emoji: '📅', text: 'Days 2–7 complete action plans' },
  { emoji: '💪', text: 'All practice exercises & deliverables' },
  { emoji: '🏆', text: 'End of Week Result summary' },
  { emoji: '⚠️', text: 'Common Mistakes to avoid' },
  { emoji: '🎁', text: 'Bonus Resource link' },
  { emoji: '📥', text: 'PDF download access' },
];

export default function PaywallModal({ planId, onUnlocked }: PaywallModalProps) {
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const submitMutation = useSubmitTransactionId();

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleVerify = async () => {
    setError('');

    if (!transactionId.trim()) {
      setError('Please enter your UPI Transaction ID.');
      return;
    }

    if (transactionId.trim().length < 6) {
      setError('Transaction ID seems too short. Please check and try again.');
      return;
    }

    try {
      await submitMutation.mutateAsync({ planId, transactionId: transactionId.trim() });
      setSuccess(true);
      setTimeout(() => {
        onUnlocked();
      }, 1200);
    } catch (err) {
      setError('Verification failed. Please check your Transaction ID and try again.');
    }
  };

  if (success) {
    return (
      <div
        className="rounded-3xl border overflow-hidden text-center animate-bounce-in"
        style={{
          background: 'linear-gradient(160deg, oklch(0.14 0.04 265), oklch(0.18 0.06 280))',
          borderColor: 'oklch(0.78 0.22 140 / 0.4)',
          boxShadow: '0 0 40px oklch(0.78 0.22 140 / 0.2)',
        }}
      >
        <div className="p-10">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-4xl animate-float"
            style={{
              background: 'linear-gradient(135deg, oklch(0.78 0.22 140), oklch(0.72 0.18 200))',
              boxShadow: '0 8px 24px oklch(0.78 0.22 140 / 0.4)',
            }}
          >
            🎉
          </div>
          <h3 className="font-display font-extrabold text-2xl mb-2 gradient-text-rainbow">
            Sprint Unlocked!
          </h3>
          <p className="text-sm" style={{ color: 'oklch(0.75 0.05 265)' }}>
            Loading your full 7-day plan… 🚀
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl overflow-hidden animate-slide-up"
      style={{
        background: 'linear-gradient(160deg, oklch(0.13 0.04 265), oklch(0.17 0.06 280), oklch(0.14 0.05 300))',
        border: '1px solid oklch(0.52 0.28 295 / 0.25)',
        boxShadow: '0 24px 60px oklch(0.10 0.04 265 / 0.8), 0 0 0 1px oklch(0.52 0.28 295 / 0.1)',
      }}
    >
      {/* ── Premium Header ── */}
      <div
        className="relative p-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, oklch(0.52 0.28 295 / 0.9), oklch(0.62 0.28 350 / 0.85), oklch(0.55 0.22 220 / 0.8))',
          borderBottom: '1px solid oklch(1 0 0 / 0.08)',
        }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, oklch(1 0 0 / 0.08), transparent 70%)' }}
        />
        <div
          className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, oklch(0.72 0.18 200 / 0.15), transparent 70%)' }}
        />

        <div className="relative flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'oklch(1 0 0 / 0.15)',
              border: '1px solid oklch(1 0 0 / 0.25)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-extrabold text-xl text-white leading-tight">
                Unlock Full SkillSprint
              </h3>
            </div>
            <p className="text-white/75 text-sm">Complete 7-day personalised plan — one-time payment</p>
            <div
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-sm font-bold text-white"
              style={{
                background: 'oklch(1 0 0 / 0.18)',
                border: '1px solid oklch(1 0 0 / 0.3)',
              }}
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              One-time payment of just {AMOUNT}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* ── What you unlock ── */}
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: 'oklch(0.65 0.15 295)' }}
          >
            ✨ What you unlock
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {UNLOCK_PERKS.map((perk) => (
              <div
                key={perk.text}
                className="flex items-center gap-2.5 text-sm px-3 py-2.5 rounded-xl"
                style={{
                  background: 'oklch(1 0 0 / 0.04)',
                  border: '1px solid oklch(1 0 0 / 0.07)',
                }}
              >
                <span className="text-base flex-shrink-0">{perk.emoji}</span>
                <span className="font-medium" style={{ color: 'oklch(0.85 0.04 265)' }}>
                  {perk.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ borderTop: '1px solid oklch(1 0 0 / 0.08)' }} />

        {/* ── Payment Section ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-4 h-4" style={{ color: 'oklch(0.72 0.18 200)' }} />
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: 'oklch(0.65 0.15 295)' }}
            >
              Pay via UPI
            </p>
          </div>

          <div
            className="rounded-2xl p-4 space-y-3"
            style={{
              background: 'oklch(1 0 0 / 0.04)',
              border: '1px solid oklch(1 0 0 / 0.1)',
            }}
          >
            {/* UPI ID row */}
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{
                background: 'oklch(0.52 0.28 295 / 0.12)',
                border: '1px solid oklch(0.52 0.28 295 / 0.25)',
              }}
            >
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: 'oklch(0.65 0.15 295)' }}>
                  UPI ID
                </p>
                <span
                  className="text-sm font-mono font-bold"
                  style={{ color: 'oklch(0.90 0.06 265)' }}
                >
                  {UPI_ID}
                </span>
              </div>
              <button
                onClick={handleCopyUpi}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{
                  background: copied ? 'oklch(0.78 0.22 140 / 0.2)' : 'oklch(0.52 0.28 295 / 0.2)',
                  color: copied ? 'oklch(0.78 0.22 140)' : 'oklch(0.75 0.18 295)',
                  border: `1px solid ${copied ? 'oklch(0.78 0.22 140 / 0.3)' : 'oklch(0.52 0.28 295 / 0.3)'}`,
                }}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Amount row */}
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{
                background: 'oklch(0.62 0.28 350 / 0.1)',
                border: '1px solid oklch(0.62 0.28 350 / 0.2)',
              }}
            >
              <p className="text-xs font-semibold" style={{ color: 'oklch(0.65 0.15 295)' }}>
                Amount
              </p>
              <span className="text-2xl font-display font-extrabold gradient-text-purple">
                {AMOUNT}
              </span>
            </div>

            <p className="text-xs leading-relaxed px-1" style={{ color: 'oklch(0.60 0.05 265)' }}>
              Open GPay, PhonePe, or Paytm → pay{' '}
              <strong style={{ color: 'oklch(0.80 0.06 265)' }}>{AMOUNT}</strong> to{' '}
              <strong style={{ color: 'oklch(0.80 0.06 265)' }}>{UPI_ID}</strong> → enter the
              transaction ID below 👇
            </p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ borderTop: '1px solid oklch(1 0 0 / 0.08)' }} />

        {/* ── Transaction ID Input ── */}
        <div className="space-y-2">
          <Label
            htmlFor="txn-id"
            className="text-sm font-bold flex items-center gap-2"
            style={{ color: 'oklch(0.88 0.05 265)' }}
          >
            <Lock className="w-3.5 h-3.5" style={{ color: 'oklch(0.65 0.15 295)' }} />
            Enter your UPI Transaction ID
          </Label>
          <Input
            id="txn-id"
            type="text"
            placeholder="e.g. 123456789012"
            value={transactionId}
            onChange={(e) => {
              setTransactionId(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            className="font-mono rounded-xl h-12 text-sm"
            style={{
              background: 'oklch(1 0 0 / 0.05)',
              border: `1.5px solid ${error ? 'oklch(0.62 0.28 350 / 0.7)' : 'oklch(0.52 0.28 295 / 0.35)'}`,
              color: 'oklch(0.92 0.03 265)',
              outline: 'none',
            }}
          />
          {error && (
            <div
              className="flex items-center gap-2 text-xs font-medium p-2.5 rounded-xl"
              style={{
                background: 'oklch(0.62 0.28 350 / 0.12)',
                color: 'oklch(0.75 0.22 350)',
                border: '1px solid oklch(0.62 0.28 350 / 0.25)',
              }}
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* ── Verify Button ── */}
        <button
          onClick={handleVerify}
          disabled={submitMutation.isPending}
          className="w-full h-13 rounded-xl text-white font-display font-bold text-base transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          style={{
            background: submitMutation.isPending
              ? 'oklch(0.45 0.20 295)'
              : 'linear-gradient(135deg, oklch(0.52 0.28 295), oklch(0.58 0.28 340), oklch(0.62 0.28 350))',
            boxShadow: submitMutation.isPending
              ? 'none'
              : '0 8px 24px oklch(0.52 0.28 295 / 0.45), 0 2px 8px oklch(0.62 0.28 350 / 0.3)',
            padding: '0.75rem 1.5rem',
          }}
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              <BadgeCheck className="w-5 h-5" />
              Verify & Unlock 🚀
            </>
          )}
        </button>

        {/* ── Trust Notice ── */}
        <div
          className="flex items-start gap-3 rounded-xl p-4"
          style={{
            background: 'oklch(0.55 0.18 60 / 0.08)',
            border: '1px solid oklch(0.72 0.18 60 / 0.25)',
          }}
        >
          <ShieldCheck
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: 'oklch(0.78 0.18 60)' }}
          />
          <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.72 0.10 60)' }}>
            <strong style={{ color: 'oklch(0.82 0.14 60)' }}>
              Payments are verified manually for this beta launch.
            </strong>{' '}
            Please enter correct UPI Transaction ID. Invalid entries may result in access revocation.
          </p>
        </div>
      </div>
    </div>
  );
}
