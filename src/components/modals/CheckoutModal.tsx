import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Shield, ArrowRight, Zap, CreditCard, Lock } from 'lucide-react';
import { PRICING_TIERS, PlanTier } from '../../lib/stripe';
import { FlashGlowCard } from '../common/FlashGlowCard';

interface CheckoutModalProps {
  isOpen: boolean;
  initialTierId?: string;
  userEmail: string;
  onClose: () => void;
  onConfirmSuccess: (tier: PlanTier) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  initialTierId = 'pro',
  userEmail,
  onClose,
  onConfirmSuccess,
}) => {
  const [selectedTierId, setSelectedTierId] = useState<string>(initialTierId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialTierId) {
      setSelectedTierId(initialTierId);
    }
  }, [initialTierId, isOpen]);

  if (!isOpen) return null;

  const currentTier = PRICING_TIERS.find((t) => t.id === selectedTierId) || PRICING_TIERS[1];

  const handleStartTrial = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirmSuccess(currentTier);
        onClose();
        setIsSuccess(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl">
        <FlashGlowCard glowColor="rainbow" withFlashLine className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2.5 py-0.5 text-[10px] font-bold text-yellow-300">
                  <Sparkles className="h-3 w-3" /> 14-DAY FULL UNLOCK
                </span>
                <span className="text-[11px] text-slate-400 font-mono">No upfront charge</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Activate Enterprise Engine
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tier Switcher Pills */}
          <div className="grid grid-cols-3 gap-2 my-5">
            {PRICING_TIERS.map((tier) => {
              const isSelected = tier.id === selectedTierId;
              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`relative p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-600/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'border-white/10 bg-slate-900/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold text-white truncate">{tier.name}</div>
                  <div className="text-sm font-black text-purple-300 tabular-nums">
                    ${tier.price}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-white">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Plan Highlights Box */}
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 mb-6 space-y-2.5">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
              <span className="text-slate-400 font-medium">Provisioning User:</span>
              <span className="font-mono text-cyan-300 font-semibold">{userEmail}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{currentTier.leadQuota}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{currentTier.proxyRotation}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{currentTier.outreachLimit}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Full Developer REST API + Webhooks</span>
              </div>
            </div>
          </div>

          {/* Guarantee / Security badge */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-6 bg-slate-900/40 p-2.5 rounded-lg border border-white/5">
            <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              Cancel anytime in 1 click during the 14-day trial. Zero penalty. Instant node access.
            </span>
          </div>

          {/* Action Button */}
          {isSuccess ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-emerald-300 font-bold text-sm">
              <Check className="h-4 w-4" />
              <span>Subscription & 14-Day Trial Activated!</span>
            </div>
          ) : (
            <button
              onClick={handleStartTrial}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 p-3.5 text-sm font-bold text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Provisioning Node Access...</span>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>Start 14-Day Free Access Now</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          )}
        </FlashGlowCard>
      </div>
    </div>
  );
};

export default CheckoutModal;
