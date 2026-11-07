import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Send, 
  Server, 
  ArrowRight, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  Cpu, 
  Radio, 
  Layers, 
  ExternalLink 
} from 'lucide-react';
import { FlashGlowCard } from '../common/FlashGlowCard';

interface LandingViewProps {
  onGoToScanner: () => void;
  onOpenCheckout: (tierId?: string) => void;
  onGoToPricing: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onGoToScanner,
  onOpenCheckout,
  onGoToPricing,
}) => {
  const [demoQuery, setDemoQuery] = useState('Cosmetic Dentists');
  const [demoCity, setDemoCity] = useState('Austin, TX');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState<any>(null);

  const runDemoScan = () => {
    setDemoLoading(true);
    setTimeout(() => {
      setDemoLoading(false);
      setDemoResult({
        businessName: 'Apex Artisan Dental Group',
        category: 'Cosmetic Dentist',
        rating: 4.9,
        reviews: 428,
        phone: '+1 (512) 890-4120',
        email: 'director@apexartisandental.com',
        address: `100 Congress Ave, ${demoCity}`,
        proxyUsed: 'Residential Egress Node #42',
      });
    }, 1200);
  };

  return (
    <div className="space-y-24 py-10">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-8 pb-16">
        {/* Ambient Color Auras */}
        <div className="pointer-events-none absolute left-1/2 -top-24 -translate-x-1/2 h-96 w-96 rounded-full bg-purple-600/25 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute left-1/4 top-1/2 h-64 w-64 rounded-full bg-orange-500/15 blur-[90px]" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wide mb-6">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>CYBER-FUTURISTIC ROTATING PROXY SCRAPER ENGINE</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[1.08] max-w-5xl mx-auto">
          Extract Google Maps Leads <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 via-orange-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            At Enterprise Scale
          </span>
        </h1>

        <p className="mt-6 text-slate-300 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
          Paste Google Maps search links or filter by Zip Code, City, and Country.
          Aggregate verified phone numbers, decision maker emails, addresses, ratings, and automate outreach instantly.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onOpenCheckout('pro')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-8 py-4 text-sm font-black text-white shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_45px_rgba(168,85,247,0.8)] transition-all hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Start 14-Day Free Trial</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>

          <button
            onClick={onGoToScanner}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-slate-900/80 px-8 py-4 text-sm font-bold text-white hover:bg-slate-800 hover:border-purple-500/40 transition-all"
          >
            <Search className="h-4 w-4 text-purple-400" />
            <span>Open Lead Scanner Live</span>
          </button>
        </div>

        {/* Proof Row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 100% Anti-Bot Bypass
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Sub-50ms Residential Latency
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Real-time MX Email Verification
          </span>
        </div>

        {/* Interactive Live Mini-Scanner Card */}
        <div className="mt-16 max-w-4xl mx-auto text-left">
          <FlashGlowCard glowColor="rainbow" withFlashLine className="p-6 md:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Live Interactive Extraction Preview
                </h3>
              </div>
              <span className="text-[11px] font-mono text-purple-300">Try Instant Sandbox</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
              <div className="md:col-span-5">
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Target Niche</label>
                <input
                  type="text"
                  value={demoQuery}
                  onChange={(e) => setDemoQuery(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 text-xs text-white"
                  placeholder="e.g. Commercial Roofing"
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Location</label>
                <input
                  type="text"
                  value={demoCity}
                  onChange={(e) => setDemoCity(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 text-xs text-white"
                  placeholder="e.g. Austin, TX"
                />
              </div>
              <div className="md:col-span-3 flex items-end">
                <button
                  onClick={runDemoScan}
                  disabled={demoLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 px-4 text-xs font-bold text-white transition-all disabled:opacity-50"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>{demoLoading ? 'Rotating...' : 'Simulate Scrape'}</span>
                </button>
              </div>
            </div>

            {demoResult && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold">
                      Extracted & Enriched in 1.2s
                    </span>
                    <h4 className="text-base font-bold text-white mt-1.5">{demoResult.businessName}</h4>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">{demoResult.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-white text-xs">{demoResult.rating}</span>
                      <span className="text-[10px] text-slate-400">({demoResult.reviews})</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 block mt-1">{demoResult.proxyUsed}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-xs font-mono">
                  <div className="text-slate-300 flex items-center gap-1.5">
                    <span className="text-slate-500">Email:</span>
                    <strong className="text-emerald-400">{demoResult.email}</strong>
                  </div>
                  <div className="text-slate-300 flex items-center gap-1.5">
                    <span className="text-slate-500">Phone:</span>
                    <strong>{demoResult.phone}</strong>
                  </div>
                </div>
              </div>
            )}
          </FlashGlowCard>
        </div>
      </section>

      {/* 3 Pillars Architecture */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-white tracking-tight">
            How The Gods Lead Architecture Works
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-2">
            A battle-tested full stack crawler pipeline designed for zero IP bans and maximum lead fidelity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FlashGlowCard glowColor="purple" className="p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 mb-6">
              <Server className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">01. Dynamic Proxy Rotation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every request cycles through a distributed pool of residential and datacenter nodes. Automatic round-robin latency routing guarantees zero CAPTCHA throttling.
            </p>
          </FlashGlowCard>

          <FlashGlowCard glowColor="orange" className="p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600/20 border border-orange-500/40 text-orange-300 mb-6">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">02. Deep Contact Enrichment</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In addition to basic Google Maps data, the engine traverses linked company websites and social registries to extract verified decision-maker emails and direct phone extensions.
            </p>
          </FlashGlowCard>

          <FlashGlowCard glowColor="green" className="p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 mb-6">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">03. Automated Smart Outreach</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Convert scraped leads into active deals with automated, highly personalized email outreach sequences featuring customizable variable placeholders and real-time open tracking.
            </p>
          </FlashGlowCard>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FlashGlowCard glowColor="rainbow" withFlashLine className="p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Ready to Supercharge Your B2B Pipeline?
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mt-4">
            Join enterprise agencies and revenue teams scaling their outbound deals with Gods Lead Engine.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenCheckout('pro')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-8 py-4 text-sm font-black text-white shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Activate 14-Day Free Access</span>
            </button>
            <button
              onClick={onGoToPricing}
              className="rounded-xl border border-white/20 bg-slate-900/60 px-8 py-4 text-sm font-bold text-white hover:bg-slate-800 transition-all"
            >
              View Pricing Comparison
            </button>
          </div>
        </FlashGlowCard>
      </section>
    </div>
  );
};

export default LandingView;
