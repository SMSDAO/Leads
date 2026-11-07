'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Key, Shield, Radio, Check, Copy } from 'lucide-react';

export default function DevPortalPage() {
  return (
    <div className="min-h-screen bg-[#05060b] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h1 className="text-3xl font-black">Developer SDK & API Console</h1>
            <p className="text-slate-400 text-sm">Programmatic Lead Extraction & Webhooks Engine</p>
          </div>
          <Link href="/dashboard" className="text-xs text-purple-400 hover:underline">
            ← Open Lead Scanner
          </Link>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-6 space-y-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Key className="h-5 w-5" />
            <span>Active Master Secret Key</span>
          </div>
          <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-white/10 font-mono text-xs">
            <code className="text-cyan-400">gods_live_sk_948f2b1897c5e219aa439bc0192</code>
            <span className="text-slate-400 text-[10px]">Production Scope</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Terminal className="h-4 w-4 text-purple-400" />
            cURL Example Request
          </h2>
          <pre className="bg-black/70 p-4 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto border border-white/10">
{`curl -X POST https://api.godslead.engine/v1/crawl \\
  -H "Authorization: Bearer gods_live_sk_948f2b1897c5e219aa439bc0192" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Dental Clinics in Austin, TX",
    "deepEnrich": true,
    "proxyPool": "residential-elite"
  }'`}
          </pre>
        </div>
      </div>
    </div>
  );
}
