import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  Copy,
  Check,
  MessageCircle,
  Zap,
} from 'lucide-react';

interface PaywallModalProps {
  planId: string;
  onClose?: () => void;
}

const UPI_ID = 'nidhi.aesticare@okhdfcbank';
const AMOUNT = '₹20';
const WHATSAPP_NUMBER = '919876543210'; // Replace with real WhatsApp number
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hi! I have paid ₹20 via UPI for the 7-Day Skill Sprint. Please find my payment screenshot attached.'
);

const UNLOCK_PERKS = [
  { emoji: '📅', text: 'Days 2–7 complete action plans' },
  { emoji: '💪', text: 'All practice exercises & deliverables' },
  { emoji: '🏆', text: 'End of Week Result summary' },
  { emoji: '⚠️', text: 'Common Mistakes to avoid' },
  { emoji: '🎁', text: 'Bonus Resource link' },
  { emoji: '📥', text: 'PDF download access' },
];

export default function PaywallModal({ planId, onClose }: PaywallModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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

        {/* ── How to unlock instruction ── */}
        <div
          className="rounded-2xl p-4 text-center"
          style={{
            background: 'linear-gradient(135deg, oklch(0.52 0.28 295 / 0.12), oklch(0.62 0.28 350 / 0.08))',
            border: '1px solid oklch(0.52 0.28 295 / 0.25)',
          }}
        >
          <p className="text-sm font-semibold leading-relaxed" style={{ color: 'oklch(0.88 0.05 265)' }}>
            To unlock the full 7-Day Skill Sprint, pay{' '}
            <strong style={{ color: 'oklch(0.85 0.2 90)' }}>{AMOUNT}</strong> via UPI and share your
            payment screenshot on{' '}
            <strong style={{ color: 'oklch(0.78 0.22 140)' }}>WhatsApp</strong>.
          </p>
        </div>

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
            className="rounded-2xl p-4 space-y-4"
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
                Amount to Pay
              </p>
              <span className="text-2xl font-display font-extrabold gradient-text-purple">
                {AMOUNT}
              </span>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-3 pt-1">
              <p className="text-xs font-semibold" style={{ color: 'oklch(0.65 0.15 295)' }}>
                Scan QR Code to Pay
              </p>
              <div
                className="rounded-2xl p-3 inline-block"
                style={{
                  background: 'white',
                  border: '2px solid oklch(0.52 0.28 295 / 0.3)',
                  boxShadow: '0 4px 16px oklch(0.52 0.28 295 / 0.2)',
                }}
              >
                <img
                  src="/assets/generated/upi-qr.dim_600x700.png"
                  alt="UPI QR Code for nidhi.aesticare@okhdfcbank"
                  className="w-52 object-contain rounded-xl"
                  style={{ maxHeight: '280px' }}
                />
              </div>
              <p className="text-xs text-center" style={{ color: 'oklch(0.60 0.05 265)' }}>
                Open GPay, PhonePe, or Paytm and scan this QR code
              </p>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ borderTop: '1px solid oklch(1 0 0 / 0.08)' }} />

        {/* ── WhatsApp Section ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4" style={{ color: 'oklch(0.78 0.22 140)' }} />
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: 'oklch(0.65 0.15 295)' }}
            >
              Share Screenshot on WhatsApp
            </p>
          </div>

          <div
            className="rounded-2xl p-4 space-y-3"
            style={{
              background: 'oklch(0.78 0.22 140 / 0.06)',
              border: '1px solid oklch(0.78 0.22 140 / 0.2)',
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.82 0.05 265)' }}>
              After payment, send your screenshot to us on WhatsApp and we'll manually activate your
              access.
            </p>

            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{
                background: 'oklch(0.78 0.22 140 / 0.1)',
                border: '1px solid oklch(0.78 0.22 140 / 0.25)',
              }}
            >
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: 'oklch(0.65 0.18 140)' }}>
                  WhatsApp Number
                </p>
                <span className="text-sm font-mono font-bold" style={{ color: 'oklch(0.90 0.06 265)' }}>
                  +91 98765 43210
                </span>
              </div>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl text-white font-display font-bold text-sm transition-all duration-200 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, oklch(0.55 0.22 140), oklch(0.65 0.20 155))',
                boxShadow: '0 6px 20px oklch(0.55 0.22 140 / 0.4)',
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Open WhatsApp 💬
            </a>
          </div>
        </div>

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
              Access is activated manually after payment verification.
            </strong>{' '}
            Please share a clear screenshot of your payment confirmation on WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
