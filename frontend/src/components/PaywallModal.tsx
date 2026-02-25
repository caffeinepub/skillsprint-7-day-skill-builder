import React, { useState } from 'react';
import { Lock, Smartphone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSubmitTransactionId } from '@/hooks/useQueries';

interface PaywallModalProps {
  planId: string;
  onUnlocked: () => void;
}

const UPI_ID = 'skillsprint@upi';
const AMOUNT = '₹20';

export default function PaywallModal({ planId, onUnlocked }: PaywallModalProps) {
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submitMutation = useSubmitTransactionId();

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
      <div className="bg-card rounded-2xl border border-blue-200 card-shadow-md p-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="font-display font-bold text-xl text-foreground mb-2">Sprint Unlocked!</h3>
        <p className="text-muted-foreground text-sm">Loading your full 7-day plan…</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border card-shadow-md overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl">Unlock Full SkillSprint</h3>
            <p className="text-blue-100 text-sm">Get access to all 7 days of your plan</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* What you get */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">What you unlock:</p>
          <ul className="space-y-2">
            {[
              'Days 2–7 complete action plans',
              'All practice exercises & deliverables',
              'End of Week Result summary',
              'Common Mistakes to avoid',
              'Bonus Resource link',
              'PDF download access',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment instructions */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Pay via UPI</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-100">
              <span className="text-xs text-muted-foreground">UPI ID</span>
              <span className="text-sm font-mono font-semibold text-foreground">{UPI_ID}</span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-100">
              <span className="text-xs text-muted-foreground">Amount</span>
              <span className="text-lg font-display font-bold text-blue-600">{AMOUNT}</span>
            </div>
          </div>

          <p className="text-xs text-blue-700 mt-3 leading-relaxed">
            Open any UPI app (GPay, PhonePe, Paytm), pay <strong>{AMOUNT}</strong> to <strong>{UPI_ID}</strong>, then enter the transaction ID below.
          </p>
        </div>

        {/* Transaction ID input */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="txn-id" className="text-sm font-semibold text-foreground">
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
            className={`font-mono ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          />
          {error && (
            <div className="flex items-center gap-1.5 text-destructive text-xs">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        <Button
          onClick={handleVerify}
          disabled={submitMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 rounded-xl"
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Verify & Unlock
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-3">
          Transaction IDs are accepted as-is. No automated verification.
        </p>
      </div>
    </div>
  );
}
