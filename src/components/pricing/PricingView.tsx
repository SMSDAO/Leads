import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Shield, 
  ArrowRight, 
  Calculator, 
  HelpCircle,
  Flame,
  Star
} from 'lucide-react';
import { PRICING_TIERS, PlanTier } from '../../lib/stripe';
import { FlashGlowCard } from '../common/FlashGlowCard';

interface PricingViewProps {
  onSelectTier: (tierId: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onSelectTier }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // ROI Calculator states
  const [leadsPerMonth, setLeadsPerMonth] = useState(5000);
  const [dealValue, setDealValue] = useState(1500);
  const [closeRate, setCloseRate] = useState(3); // 3%

  const estimatedDeals = Math.max(1, Math.round((leadsPerMonth * 0.05 * (closeRate / 100))));
  const estimatedRevenue = estimatedDeals * dealValue;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      {/* Pricing Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wide">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>14-DAY UNLIMITED PRO TRIAL ON ALL PLANS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Transparent, High-Velocity <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Enterprise Lead Infrastructure
          </span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Unlimited Google Maps business parsing, rotating residential proxy clusters, and automated decision-maker outreach.
        </p>

        {/* Billing cycle toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="relative h-6 w-12 rounded-full bg-slate-800 p-0.5 transition-colors border border-white/20"
          >
            <div
              className={`h-5 w-5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
            <span>Annual</span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] text-emerald-300 font-bold">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {PRICING_TIERS.map((tier) => {
          const isApex = tier.id === 'pro';
          const displayPrice = billingCycle === 'annual' ? Math.round(tier.price * 0.8) : tier.price;

          return (
            <FlashGlowCard
              key={tier.id}
              glowColor={isApex ? 'rainbow' : tier.id === 'gods' ? 'yellow' : 'purple'}
              withFlashLine={isApex}
              className={`p-8 flex flex-col justify-between relative ${
                isApex ? 'scale-105 z-10' : ''
              }`}
            >
              <div>
                {isApex && (
                  <div className="inline-block rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-3 py-1 text-[10px] font-black text-white uppercase tracking-wider mb-3">
                    MOST POPULAR // ENTERPRISE CHOICE
                  </div>
                )}
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{tier.description}</p>

                <div className="my-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white tabular-nums">${displayPrice}</span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono block mt-1">
                    Includes 14-Day Full Free Access
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10 text-xs mb-8">
                  <div className="flex items-center gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="font-medium">{tier.leadQuota}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{tier.proxyRotation}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{tier.outreachLimit}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>REST API & Webhooks Access</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{tier.support}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectTier(tier.id)}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition-all ${
                  isApex
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)]'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                <span>Start 14-Day Free Trial</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </FlashGlowCard>
          );
        })}
      </div>

      {/* Interactive ROI Potential Calculator */}
      <FlashGlowCard glowColor="purple" withFlashLine className="p-8">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-black text-white">Interactive Pipeline ROI Calculator</h2>
        </div>
        <p className="text-xs text-slate-400 mb-8 max-w-2xl">
          Model your projected inbound customer revenue based on Google Maps extraction volume and your sales close rate.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-300 font-semibold">Monthly Leads Extracted:</span>
                <span className="font-mono text-purple-300 font-bold tabular-nums">
                  {leadsPerMonth.toLocaleString()} leads
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={leadsPerMonth}
                onChange={(e) => setLeadsPerMonth(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-300 font-semibold">Average Customer Contract Value:</span>
                <span className="font-mono text-cyan-300 font-bold tabular-nums">
                  ${dealValue.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="10000"
                step="100"
                value={dealValue}
                onChange={(e) => setDealValue(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-300 font-semibold">Sales Pipeline Close Rate:</span>
                <span className="font-mono text-emerald-300 font-bold tabular-nums">{closeRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={closeRate}
                onChange={(e) => setCloseRate(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-purple-500/40 bg-purple-950/20 p-6 text-center space-y-3">
            <span className="text-xs uppercase tracking-wider text-purple-300 font-bold block">
              Estimated Added Monthly Pipeline
            </span>
            <div className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tight">
              ${estimatedRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-300">
              ~<strong className="text-emerald-400 font-mono">{estimatedDeals} closed deals</strong> per month from verified cold outreach.
            </div>
            <div className="pt-2">
              <button
                onClick={() => onSelectTier('pro')}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                Capture This Revenue (14-Day Trial)
              </button>
            </div>
          </div>
        </div>
      </FlashGlowCard>
    </div>
  );
};

export default PricingView;
