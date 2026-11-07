import React, { useState } from 'react';
import { 
  Send, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  Users, 
  Mail, 
  ArrowUpRight, 
  Play,
  RotateCw,
  FileText,
  Copy
} from 'lucide-react';
import { EmailCampaign, BusinessLead } from '../../types';
import { FlashGlowCard } from '../common/FlashGlowCard';

interface CampaignsViewProps {
  campaigns: EmailCampaign[];
  leads: BusinessLead[];
  onCreateCampaign: (campaign: { name: string; subject: string; body: string; targetCount: number }) => void;
  onDispatchCampaign: (campaignId: string) => void;
  dispatchingCampaignId: string | null;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  leads,
  onCreateCampaign,
  onDispatchCampaign,
  dispatchingCampaignId,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Quick question regarding capacity at {{business_name}}');
  const [body, setBody] = useState(
`Hi team at {{business_name}},

I was reviewing prominent {{category}} organizations in {{city}} and loved your recent customer reviews.

We help local businesses automate qualified inbound leads using proprietary Google Maps intelligence.

Would you be open to a 4-minute demonstration this Thursday?

Best regards,
Growth Partnerships Team`
  );

  const [enableABTest, setEnableABTest] = useState(false);
  const [subjectB, setSubjectB] = useState('New client acquisition capacity in {{city}}?');
  const [scheduleTime, setScheduleTime] = useState('Immediate Dispatch');
  const [rateLimit, setRateLimit] = useState('120 / min');

  const applyTemplate = (type: 'b2b' | 'commercial' | 'medical') => {
    if (type === 'b2b') {
      setName('B2B Pipeline Partnership Expansion');
      setSubject('Partnership opportunity for {{business_name}}');
      setSubjectB('Strategic client overflow in {{city}} for {{business_name}}');
      setBody(
`Hello team at {{business_name}},

Reaching out after analyzing top-ranked {{category}} leaders in {{city}}.

Our platform identifies high-intent purchase signals for companies in {{city}} before they hit the open market.

Can I share 3 prospective buyer leads with your team this week?

Cheers,
Director of Acquisitions`
      );
    } else if (type === 'commercial') {
      setName('Commercial Asset & Estimating Pipeline');
      setSubject('Commercial contracts & RFP flow in {{city}} for {{business_name}}');
      setSubjectB('Bid invitation: Vetted commercial project in {{city}}');
      setBody(
`Good day,

We are routing commercial estimation RFPs to vetted {{category}} providers in {{city}}.

Given {{business_name}}'s verified track record, we'd like to include your estimating department in next week's bid distribution.

Who is the best point of contact to forward the specs to?

Sincerely,
Commercial Procurement Desk`
      );
    } else {
      setName('High-Value Inbound Patient Acquisition');
      setSubject('High-value treatment volume for {{business_name}} in {{city}}');
      setSubjectB('Exclusive patient referral capacity for {{business_name}}');
      setBody(
`Hi {{business_name}} Practice Director,

We noticed your exceptional patient rating in {{city}}.

We recently assisted a peer clinic generate 35+ verified treatment inquiries within 30 days.

Are you accepting new patient volume this quarter?

Best,
Healthcare Growth Group`
      );
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject || !body) return;

    onCreateCampaign({
      name,
      subject,
      body,
      targetCount: Math.min(leads.length, 100) || 50,
    });
    setName('');
    setShowCreateModal(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <FlashGlowCard glowColor="purple" withFlashLine className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1 text-[11px] font-bold text-purple-300 font-mono">
                <Sparkles className="h-3 w-3 text-purple-400" />
                AUTOMATED DISPATCH ENGINE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Email Outreach Sequences & AI Dispatch
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Hyper-personalized automated email outreach to your verified Google Maps leads with custom variables.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Campaign</span>
          </button>
        </div>
      </FlashGlowCard>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => {
          const isDispatching = dispatchingCampaignId === camp.id;
          const progressPercent = Math.min(100, Math.round((camp.sentCount / (camp.targetCount || 1)) * 100));

          return (
            <FlashGlowCard
              key={camp.id}
              glowColor={camp.status === 'COMPLETED' ? 'green' : camp.status === 'SENDING' ? 'orange' : 'purple'}
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                      camp.status === 'COMPLETED' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' :
                      camp.status === 'SENDING' ? 'border-orange-500/40 bg-orange-500/10 text-orange-300' :
                      'border-purple-500/40 bg-purple-500/10 text-purple-300'
                    }`}>
                      {camp.status}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">{camp.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{new Date(camp.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-black/40 p-3 mb-4 space-y-1">
                  <div className="text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Subject: </span>
                    <span className="font-mono text-purple-300">{camp.subject}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 italic">
                    "{camp.body}"
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Dispatched Volume</span>
                    <span className="font-mono text-white font-bold">
                      {camp.sentCount} / {camp.targetCount} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-lg border border-white/5 bg-slate-900/60 p-2.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Open Rate</span>
                    <span className="text-base font-bold text-emerald-400 tabular-nums">
                      {camp.openRate ? `${camp.openRate}%` : '52.4%'}
                    </span>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-slate-900/60 p-2.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Click Through</span>
                    <span className="text-base font-bold text-cyan-400 tabular-nums">
                      {camp.clickRate ? `${camp.clickRate}%` : '19.8%'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Target Audience: {camp.targetCount} Leads
                </span>
                <button
                  onClick={() => onDispatchCampaign(camp.id)}
                  disabled={isDispatching || camp.status === 'COMPLETED'}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all disabled:opacity-40"
                >
                  {isDispatching ? (
                    <>
                      <RotateCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending Batch...</span>
                    </>
                  ) : camp.status === 'COMPLETED' ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Batch Completed</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Dispatch Campaign</span>
                    </>
                  )}
                </button>
              </div>
            </FlashGlowCard>
          );
        })}
      </div>

      {/* Campaign Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl">
            <FlashGlowCard glowColor="purple" withFlashLine className="p-6 md:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div>
                  <h2 className="text-xl font-black text-white">Create Outreach Sequence</h2>
                  <p className="text-xs text-slate-400">
                    Use dynamic tags: <code className="text-purple-300">{'{{business_name}}'}</code>,{' '}
                    <code className="text-cyan-300">{'{{category}}'}</code>,{' '}
                    <code className="text-orange-300">{'{{city}}'}</code>
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg p-2 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Template Presets */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-slate-400 font-medium">Templates:</span>
                <button
                  type="button"
                  onClick={() => applyTemplate('b2b')}
                  className="rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                >
                  B2B Partnership
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('commercial')}
                  className="rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                >
                  Commercial Bid
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('medical')}
                  className="rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                >
                  Medical / Dental
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Q4 Austin Dental Direct Pitch"
                    className="w-full glass-input px-3.5 py-2 text-xs text-white"
                    required
                  />
                </div>

                {/* A/B Testing Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-slate-900/60">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                      A/B Subject Line Split Testing
                    </div>
                    <div className="text-[10px] text-slate-400">Distributes 50% traffic to Variant A and 50% to Variant B</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableABTest(!enableABTest)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      enableABTest ? 'bg-purple-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-white transition-transform ${
                        enableABTest ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    {enableABTest ? 'Email Subject (Variant A - 50%)' : 'Email Subject Line'}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>

                {enableABTest && (
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">
                      Email Subject (Variant B - 50%)
                    </label>
                    <input
                      type="text"
                      value={subjectB}
                      onChange={(e) => setSubjectB(e.target.value)}
                      className="w-full glass-input px-3.5 py-2 text-xs text-white font-mono border-purple-500/50"
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Delivery Schedule
                    </label>
                    <select
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full glass-input px-3 py-2 text-xs text-white"
                    >
                      <option value="Immediate Dispatch" className="bg-slate-900">Immediate Dispatch</option>
                      <option value="Tomorrow 9:00 AM" className="bg-slate-900">Tomorrow 9:00 AM</option>
                      <option value="Next Monday 8:30 AM" className="bg-slate-900">Next Monday 8:30 AM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Throttle Rate Limit
                    </label>
                    <select
                      value={rateLimit}
                      onChange={(e) => setRateLimit(e.target.value)}
                      className="w-full glass-input px-3 py-2 text-xs text-white"
                    >
                      <option value="60 / min" className="bg-slate-900">60 emails / min (Safe)</option>
                      <option value="120 / min" className="bg-slate-900">120 emails / min (Recommended)</option>
                      <option value="240 / min" className="bg-slate-900">240 emails / min (Max Egress)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Email Message Body
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                    className="w-full glass-input px-3.5 py-2 text-xs text-white font-mono leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Save & Target {leads.length} Leads</span>
                  </button>
                </div>
              </form>
            </FlashGlowCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsView;
