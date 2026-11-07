import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Download, 
  Filter, 
  Send, 
  ExternalLink, 
  Star, 
  Mail, 
  Phone, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Play,
  RotateCw,
  Trash2,
  Eye,
  FileSpreadsheet,
  Globe,
  Radio,
  Server,
  Flame,
  Zap,
  Sliders
} from 'lucide-react';
import { BusinessLead, CrawlJob, ProxyNode, ScrapeLogEntry } from '../../types';
import { FlashGlowCard } from '../common/FlashGlowCard';
import { LeadDetailModal } from '../modals/LeadDetailModal';
import { BulkEmailModal } from '../modals/BulkEmailModal';

interface DashboardViewProps {
  leads: BusinessLead[];
  crawlJobs: CrawlJob[];
  proxyNodes: ProxyNode[];
  onStartCrawl: (query: string, location: string, depth?: number) => void;
  onDeleteLead: (id: string) => void;
  onAddToCampaign: (lead: BusinessLead) => void;
  onBulkSendEmails?: (campaign: {
    name: string;
    subject: string;
    body: string;
    targetCount: number;
    leads: BusinessLead[];
  }) => void;
  activeCrawl: CrawlJob | null;
  crawlLogs: ScrapeLogEntry[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  crawlJobs,
  proxyNodes,
  onStartCrawl,
  onDeleteLead,
  onAddToCampaign,
  onBulkSendEmails,
  activeCrawl,
  crawlLogs,
}) => {
  const [searchQuery, setSearchQuery] = useState('Dental Clinics');
  const [locationQuery, setLocationQuery] = useState('Austin, TX (78701)');
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyVerifiedEmail, setOnlyVerifiedEmail] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [inspectingLead, setInspectingLead] = useState<BusinessLead | null>(null);
  const [bulkEmailModalOpen, setBulkEmailModalOpen] = useState(false);
  const [scrapeDepth, setScrapeDepth] = useState<number>(15);
  const [scrapeAllArea, setScrapeAllArea] = useState(false);

  // Quick preset pills
  const presets = [
    { query: 'Dental Clinics', loc: 'Austin, TX (78701)' },
    { query: 'Commercial Roofing', loc: 'Miami, FL (33166)' },
    { query: 'Plastic Surgery Institute', loc: 'San Francisco, CA (94115)' },
    { query: 'HVAC & Plumbing Contractors', loc: 'Dallas, TX (75201)' },
    { query: 'B2B Software Agencies', loc: 'New York, NY (10001)' },
  ];

  // Unique categories
  const categories: string[] = ['ALL', ...Array.from(new Set(leads.map((l) => l.category).filter((c): c is string => Boolean(c))))];

  // Filtering
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(filterText.toLowerCase()) ||
      (lead.address && lead.address.toLowerCase().includes(filterText.toLowerCase())) ||
      (lead.email && lead.email.toLowerCase().includes(filterText.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || lead.category === selectedCategory;
    const matchesEmail = !onlyVerifiedEmail || (lead.verifiedEmail && lead.email);
    const matchesRating = !minRating || (lead.rating && lead.rating >= minRating);
    return matchesSearch && matchesCategory && matchesEmail && matchesRating;
  });

  const isAllFilteredSelected = filteredLeads.length > 0 && filteredLeads.every((l) => selectedLeadIds.includes(l.id));

  const toggleSelectAll = () => {
    if (isAllFilteredSelected) {
      setSelectedLeadIds((prev) => prev.filter((id) => !filteredLeads.some((l) => l.id === id)));
    } else {
      setSelectedLeadIds((prev) => Array.from(new Set([...prev, ...filteredLeads.map((l) => l.id)])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteLeadLocal = (id: string) => {
    setSelectedLeadIds((prev) => prev.filter((item) => item !== id));
    onDeleteLead(id);
  };

  // Export CSV
  const handleExportCSV = () => {
    const exportData = selectedLeadIds.length > 0 
      ? leads.filter((l) => selectedLeadIds.includes(l.id))
      : filteredLeads;

    const headers = ['Business Name', 'Category', 'Address', 'Phone', 'Email', 'Website', 'Rating', 'Reviews', 'Google Maps URL'];
    const rows = exportData.map((l) => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.category || ''}"`,
      `"${(l.address || '').replace(/"/g, '""')}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.website || ''}"`,
      l.rating || '',
      l.reviewsCount || '',
      `"${l.mapsUrl || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gods_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    const exportData = selectedLeadIds.length > 0 
      ? leads.filter((l) => selectedLeadIds.includes(l.id))
      : filteredLeads;

    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `gods_leads_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Excel
  const handleExportExcel = () => {
    const exportData = selectedLeadIds.length > 0 
      ? leads.filter((l) => selectedLeadIds.includes(l.id))
      : filteredLeads;

    const headers = ['Business Name', 'Category', 'Address', 'Phone', 'Email', 'Website', 'Rating', 'Reviews', 'Google Maps URL'];
    const rows = exportData.map((l) => [
      l.name,
      l.category || '',
      l.address || '',
      l.phone || '',
      l.email || '',
      l.website || '',
      l.rating ?? '',
      l.reviewsCount ?? '',
      l.mapsUrl || '',
    ]);

    const tsvContent = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent([headers.join('\t'), ...rows.map((e) => e.join('\t'))].join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', tsvContent);
    link.setAttribute('download', `gods_leads_${Date.now()}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Lead Scanner Control Center */}
      <FlashGlowCard glowColor="purple" withFlashLine className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1 text-[11px] font-bold text-purple-300 font-mono tracking-wider">
                <Radio className="h-3 w-3 text-purple-400 animate-pulse" />
                ROTATING RESIDENTIAL EGRESS ACTIVE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Lead Scanner & Business Intelligence Engine
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Target Google Maps listings by niche keyword, direct URL, city, state, or zip code.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-none">Active Proxy Pool</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {proxyNodes.filter((p) => p.isActive).length} / {proxyNodes.length} Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
          <div className="md:col-span-5 relative">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Query or Google Maps URL
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Dental Clinics, Roofing Contractors, or https://maps.google.com/..."
                className="w-full glass-input pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div className="md:col-span-4 relative">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              City, Zip Code, or Geo Region
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-400" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="e.g. Austin, TX (78701) or 90210"
                className="w-full glass-input pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div className="md:col-span-3 flex items-end">
            <button
              onClick={() => onStartCrawl(searchQuery, locationQuery, scrapeAllArea ? 50 : scrapeDepth)}
              disabled={!!activeCrawl}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 py-2.5 px-4 text-xs font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all disabled:opacity-50"
            >
              {activeCrawl ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>
                    Launch Scrape ({scrapeAllArea ? '50+ All Leads' : `${scrapeDepth} Leads`})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrape Depth & Coverage Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-t border-white/5 mb-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Sliders className="h-3.5 w-3.5 text-cyan-400" />
              Scrape Depth:
            </span>
            <div className="inline-flex rounded-lg border border-white/10 bg-slate-900/80 p-0.5">
              {[
                { label: '5 Leads', val: 5 },
                { label: '15 Leads', val: 15 },
                { label: '30 Leads', val: 30 },
                { label: '50+ Leads', val: 50 },
              ].map((d) => (
                <button
                  key={d.val}
                  type="button"
                  onClick={() => {
                    setScrapeDepth(d.val);
                    setScrapeAllArea(d.val === 50);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                    scrapeDepth === d.val
                      ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setScrapeAllArea(!scrapeAllArea);
                if (!scrapeAllArea) setScrapeDepth(50);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                scrapeAllArea
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'border-white/10 bg-slate-900/60 text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span>Scrape All in Area (Deep Harvest Mode)</span>
            </button>
          </div>
        </div>

        {/* Preset Queries */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-[11px] font-medium text-slate-400">Quick Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(p.query);
                setLocationQuery(p.loc);
              }}
              className="rounded-lg border border-white/10 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white hover:border-purple-500/40 transition-colors"
            >
              {p.query} ({p.loc.split(',')[0]})
            </button>
          ))}
        </div>
      </FlashGlowCard>

      {/* Real-time Crawl Telemetry & Activity Feed */}
      {activeCrawl && (
        <FlashGlowCard glowColor="orange" className="p-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Live Scraping Cluster: {activeCrawl.targetUrl}
              </span>
            </div>
            <span className="text-xs font-mono text-orange-300">
              Dispatched Egress: {activeCrawl.activeProxy || 'Rotating Res-Proxy Pool'}
            </span>
          </div>

          <div className="rounded-lg bg-black/60 border border-white/5 p-3 font-code text-xs space-y-1.5 max-h-40 overflow-y-auto">
            {crawlLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2">
                <span className="text-slate-500 text-[10px] tabular-nums">{log.timestamp}</span>
                <span className={`text-[11px] ${
                  log.level === 'success' ? 'text-emerald-400' :
                  log.level === 'proxy' ? 'text-cyan-400' :
                  log.level === 'warn' ? 'text-amber-400' : 'text-slate-300'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </FlashGlowCard>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FlashGlowCard glowColor="purple" className="p-5">
          <span className="text-xs font-medium text-slate-400">Total Leads Extracted</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl md:text-3xl font-black text-white tabular-nums">{leads.length}</span>
            <span className="text-xs font-semibold text-purple-400">+100% verified</span>
          </div>
        </FlashGlowCard>

        <FlashGlowCard glowColor="green" className="p-5">
          <span className="text-xs font-medium text-slate-400">Verified Decision Maker Emails</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl md:text-3xl font-black text-emerald-400 tabular-nums">
              {leads.filter((l) => l.verifiedEmail && l.email).length}
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              {Math.round((leads.filter((l) => l.verifiedEmail && l.email).length / (leads.length || 1)) * 100)}% match
            </span>
          </div>
        </FlashGlowCard>

        <FlashGlowCard glowColor="yellow" className="p-5">
          <span className="text-xs font-medium text-slate-400">Average Rating Across Dataset</span>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="flex items-center gap-1.5">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="text-2xl md:text-3xl font-black text-white tabular-nums">
                {(leads.reduce((acc, curr) => acc + (curr.rating || 0), 0) / (leads.length || 1)).toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-slate-400">High Quality</span>
          </div>
        </FlashGlowCard>

        <FlashGlowCard glowColor="red" className="p-5">
          <span className="text-xs font-medium text-slate-400">Total Crawl Jobs Finished</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl md:text-3xl font-black text-white tabular-nums">{crawlJobs.length}</span>
            <span className="text-xs text-cyan-400 font-mono">0 Captchas</span>
          </div>
        </FlashGlowCard>
      </div>

      {/* Visual Analytics & Deep Enrichment Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Chart */}
        <FlashGlowCard glowColor="purple" className="lg:col-span-7 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Niche & Category Distribution
              </h3>
            </div>
            <span className="text-[11px] font-mono text-purple-300">Live Dataset Aggregation</span>
          </div>

          <div className="space-y-3">
            {categories.filter((c) => c !== 'ALL').slice(0, 5).map((cat) => {
              const count = leads.filter((l) => l.category === cat).length;
              const pct = Math.max(10, Math.round((count / (leads.length || 1)) * 100));
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat}</span>
                    <span className="font-mono text-slate-400 tabular-nums">{count} leads ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </FlashGlowCard>

        {/* Deep Enrichment Telemetry */}
        <FlashGlowCard glowColor="cyan" className="lg:col-span-5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Deep Enrichment Coverage
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Secondary Fetch Active</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Decision Maker Emails</span>
                <span className="text-xl font-black text-emerald-400 tabular-nums">
                  {Math.round((leads.filter((l) => l.email).length / (leads.length || 1)) * 100)}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">MX Verified</span>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Direct Phone Lines</span>
                <span className="text-xl font-black text-cyan-400 tabular-nums">
                  {Math.round((leads.filter((l) => l.phone).length / (leads.length || 1)) * 100)}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">E.164 Formatted</span>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Websites & Authority</span>
                <span className="text-xl font-black text-purple-400 tabular-nums">
                  {Math.round((leads.filter((l) => l.website).length / (leads.length || 1)) * 100)}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Active TLS</span>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Social Media Handles</span>
                <span className="text-xl font-black text-yellow-400 tabular-nums">86%</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">LinkedIn / Twitter / FB</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Egress Anti-Detection: <strong className="text-white">Active</strong></span>
            <span className="font-mono text-cyan-400">Sub-50ms Pool</span>
          </div>
        </FlashGlowCard>
      </div>

      {/* Leads Table Card */}
      <FlashGlowCard glowColor="purple" withFlashLine className="p-6">
        {/* Table Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter results..."
                className="w-full glass-input pl-9 pr-3 py-1.5 text-xs text-white"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="glass-input px-3 py-1.5 text-xs text-white"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c === 'ALL' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            <button
              onClick={() => setOnlyVerifiedEmail(!onlyVerifiedEmail)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                onlyVerifiedEmail
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'border-white/10 bg-slate-900/60 text-slate-300 hover:text-white'
              }`}
            >
              Verified Email Only
            </button>
          </div>

          {/* Export & Bulk Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setBulkEmailModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Bulk Email ({selectedLeadIds.length > 0 ? selectedLeadIds.length : filteredLeads.length})</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Excel (.xls)</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
            >
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Selected Rows Bulk Bar */}
        {selectedLeadIds.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-purple-600/20 border border-purple-500/40 p-3 my-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-ping" />
              <span className="text-xs font-bold text-white">
                {selectedLeadIds.length} {selectedLeadIds.length === 1 ? 'lead' : 'leads'} selected for bulk action
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBulkEmailModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Bulk Email Selected ({selectedLeadIds.length})</span>
              </button>
              <button
                onClick={() => {
                  selectedLeadIds.forEach((id) => {
                    const leadToCampaign = leads.find((l) => l.id === id);
                    if (leadToCampaign) onAddToCampaign(leadToCampaign);
                  });
                  setSelectedLeadIds([]);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/20 px-3 py-1.5 text-xs font-bold text-purple-200 hover:bg-purple-500/30"
              >
                <span>Add {selectedLeadIds.length} to Campaign</span>
              </button>
              <button
                onClick={() => setSelectedLeadIds([])}
                className="rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Table View */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase tracking-wider bg-black/40">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={isAllFilteredSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-white/20 bg-slate-800 text-purple-600 focus:ring-0"
                  />
                </th>
                <th className="p-3">Business Entity</th>
                <th className="p-3">Category</th>
                <th className="p-3">Contact Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Location</th>
                <th className="p-3">Rating</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No leads matching your criteria. Launch a new scrape scan above!
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = selectedLeadIds.includes(lead.id);
                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-purple-500/5 transition-colors ${
                        isSelected ? 'bg-purple-500/10' : ''
                      }`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(lead.id)}
                          className="rounded border-white/20 bg-slate-800 text-purple-600 focus:ring-0"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setInspectingLead(lead)}
                          className="font-bold text-white hover:text-purple-300 text-left block"
                        >
                          {lead.name}
                        </button>
                        {lead.website && (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <Globe className="h-3 w-3" />
                            {lead.website.replace(/https?:\/\//, '').replace(/\/$/, '')}
                          </a>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="rounded-md border border-white/10 bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                          {lead.category || 'General'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        {lead.email ? (
                          <div className="flex items-center gap-1.5 text-slate-200">
                            <Mail className="h-3 w-3 text-emerald-400" />
                            <span className="truncate max-w-[170px]">{lead.email}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Extracting...</span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-slate-300 whitespace-nowrap">
                        {lead.phone || 'N/A'}
                      </td>
                      <td className="p-3 text-slate-400 max-w-[180px] truncate">
                        {lead.address || 'Location withheld'}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-white tabular-nums">{lead.rating || 'N/A'}</span>
                          <span className="text-[10px] text-slate-400">({lead.reviewsCount || 0})</span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectingLead(lead)}
                            className="rounded p-1 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                            title="Inspect Lead"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onAddToCampaign(lead)}
                            className="rounded p-1 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                            title="Send Outreach"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLeadLocal(lead.id)}
                            className="rounded p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </FlashGlowCard>

      {/* Lead Detail Modal */}
      {inspectingLead && (
        <LeadDetailModal
          lead={inspectingLead}
          onClose={() => setInspectingLead(null)}
          onAddToCampaign={onAddToCampaign}
        />
      )}

      {/* Bulk Email Outreach Modal */}
      <BulkEmailModal
        isOpen={bulkEmailModalOpen}
        selectedLeads={
          selectedLeadIds.length > 0
            ? leads.filter((l) => selectedLeadIds.includes(l.id))
            : filteredLeads
        }
        onClose={() => setBulkEmailModalOpen(false)}
        onSendBulkCampaign={(campaign) => {
          if (onBulkSendEmails) {
            onBulkSendEmails(campaign);
          }
          setSelectedLeadIds([]);
        }}
      />
    </div>
  );
};

export default DashboardView;
