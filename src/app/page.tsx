import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#05060b] text-white selection:bg-purple-600 selection:text-white">
      {/* Top Cyber Flash Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-purple-500 via-orange-500 via-red-500 via-emerald-500 to-yellow-500 opacity-80" />

      <header className="border-b border-white/10 bg-[#070a14]/80 backdrop-blur-xl py-4 px-6 md:px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          GODS LEAD ENGINE
        </div>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium hover:text-purple-400 transition">
            Pricing
          </Link>
          <Link href="/dev" className="text-sm font-medium hover:text-cyan-400 transition">
            API & Dev
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-lg text-sm font-semibold shadow-[0_0_15px_rgba(168,85,247,0.4)] transition"
          >
            Launch Scanner
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
          🚀 Powered by Advanced Proxy Rotation & AI Scrapers
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
          Extract Google Maps Leads <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            At Enterprise Scale
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Paste Google Maps links or filter by Zip Code, City, and Country. Aggregate verified phone numbers, emails, addresses, ratings, and scale your cold outreach instantly.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:scale-[1.02] rounded-xl font-bold shadow-[0_0_25px_rgba(168,85,247,0.5)] transition"
          >
            Start 14-Day Free Trial
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-4 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl font-bold transition"
          >
            View Pricing Plans
          </Link>
        </div>
      </main>
    </div>
  );
}
