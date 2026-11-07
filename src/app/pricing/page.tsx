import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { PRICING_TIERS } from '@/src/lib/stripe';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#05060b] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" /> 14-DAY FULL UNLIMITED ACCESS
          </div>
          <h1 className="text-4xl md:text-5xl font-black">Simple, Scale-Ready Pricing</h1>
          <p className="text-slate-400 text-sm">
            Everything you need to extract and close high-value business leads from Google Maps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`p-8 rounded-2xl border transition-all flex flex-col justify-between ${
                tier.id === 'pro'
                  ? 'border-purple-500/60 bg-slate-900/80 shadow-[0_0_30px_rgba(168,85,247,0.3)] scale-105'
                  : 'border-white/10 bg-slate-900/40'
              }`}
            >
              <div>
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{tier.description}</p>
                <div className="my-6">
                  <span className="text-4xl font-black text-white">${tier.price}</span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>
                <div className="space-y-3 text-xs mb-8">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>{tier.leadQuota}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>{tier.proxyRotation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>{tier.outreachLimit}</span>
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3 text-xs font-bold text-white shadow-lg hover:brightness-110"
              >
                <span>Start 14-Day Free Trial</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
