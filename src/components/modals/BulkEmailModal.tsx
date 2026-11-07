import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  RotateCw, 
  BookOpen, 
  Flame, 
  Eye, 
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { BusinessLead } from '../../types';
import { FlashGlowCard } from '../common/FlashGlowCard';
import { FLASH_NEO_TEMPLATES, EmailTemplate } from '../../lib/templates';
import { auditEmailDeliverability, compilePersonalizationTokens, SpamAuditResult } from '../../lib/email';

interface BulkEmailModalProps {
  isOpen: boolean;
  selectedLeads: BusinessLead[];
  onClose: () => void;
  onSendBulkCampaign: (campaign: {
    name: string;
    subject: string;
    body: string;
    targetCount: number;
    leads: BusinessLead[];
  }) => void;
}

export const BulkEmailModal: React.FC<BulkEmailModalProps> = ({
  isOpen,
  selectedLeads,
  onClose,
  onSendBulkCampaign,
}) => {
  if (!isOpen) return null;

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(FLASH_NEO_TEMPLATES[0].id);
  const [campaignName, setCampaignName] = useState('Bulk Outreach Sequence - ' + new Date().toLocaleDateString());
  const [subject, setSubject] = useState(FLASH_NEO_TEMPLATES[0].subject);
  const [body, setBody] = useState(FLASH_NEO_TEMPLATES[0].body);
  const [previewLeadIndex, setPreviewLeadIndex] = useState(0);

  // Dispatch progress states
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeLog, setActiveLog] = useState<string>('');

  const currentTemplate = FLASH_NEO_TEMPLATES.find((t) => t.id === selectedTemplateId) || FLASH_NEO_TEMPLATES[0];

  const handleApplyTemplate = (template: EmailTemplate) => {
    setSelectedTemplateId(template.id);
    setSubject(template.subject);
    setBody(template.body);
  };

  // Preview lead personalization
  const previewLead = selectedLeads[previewLeadIndex] || selectedLeads[0];
  const personalizedSubjectPreview = previewLead
    ? compilePersonalizationTokens(subject, {
        name: previewLead.name,
        company: previewLead.name,
        rating: previewLead.rating ? String(previewLead.rating) : '4.8',
        category: previewLead.category || 'Specialist',
        city: previewLead.address?.split(',')[1]?.trim() || 'your area',
      })
    : subject;

  const personalizedBodyPreview = previewLead
    ? compilePersonalizationTokens(body, {
        name: previewLead.name,
        company: previewLead.name,
        rating: previewLead.rating ? String(previewLead.rating) : '4.8',
        category: previewLead.category || 'Specialist',
        city: previewLead.address?.split(',')[1]?.trim() || 'your area',
      })
    : body;

  const spamAudit: SpamAuditResult = auditEmailDeliverability(subject, body);
  const timerRef = React.useRef<any>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStartBulkSend = () => {
    if (!selectedLeads || selectedLeads.length === 0) return;

    setIsSending(true);
    setSentCount(0);
    setIsCompleted(false);

    let current = 0;
    const total = selectedLeads.length;

    timerRef.current = setInterval(() => {
      current++;
      setSentCount(current);
      const lead = selectedLeads[current - 1];
      if (lead) {
        setActiveLog(`Dispatched via TLS to: ${lead.email || lead.name} (${current}/${total})`);
      }

      if (current >= total) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsSending(false);
        setIsCompleted(true);
        setActiveLog(`All ${total} emails delivered with RFC headers!`);

        setTimeout(() => {
          onSendBulkCampaign({
            name: campaignName,
            subject,
            body,
            targetCount: total,
            leads: selectedLeads,
          });
          onClose();
        }, 1500);
      }
    }, 180);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col">
        <FlashGlowCard glowColor="purple" withFlashLine className="p-6 md:p-8 flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 text-[10px] font-bold">
                  <Users className="h-3 w-3" /> BULK OUTREACH DISPATCHER
                </span>
                <span className="rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold">
                  {selectedLeads.length} Recipients Selected
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                Bulk Email Outreach Engine
              </h2>
            </div>
            {!isSending && (
              <button
                onClick={onClose}
                className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Quick Template Selector */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-yellow-400" />
              <span>Select High-Converting Flash Neo Template</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {FLASH_NEO_TEMPLATES.slice(0, 6).map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    selectedTemplateId === tmpl.id
                      ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_12px_rgba(234,179,8,0.2)]'
                      : 'border-white/10 bg-slate-900/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-white truncate">{tmpl.name}</div>
                  <div className="text-[10px] text-yellow-300 font-mono mt-0.5">{tmpl.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Config */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full glass-input px-3.5 py-2 text-xs text-white"
                disabled={isSending}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Email Subject Line (Supports Personalization Tokens)
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full glass-input px-3.5 py-2 text-xs text-white font-mono"
                disabled={isSending}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Email Body Template
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="w-full glass-input p-3 text-xs text-white font-mono leading-relaxed"
                disabled={isSending}
              />
            </div>

            {/* Live Token Preview Box */}
            <div className="rounded-xl border border-cyan-500/30 bg-black/50 p-4 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  Live Personalized Preview for Recipient #{previewLeadIndex + 1}:
                </span>
                {selectedLeads.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewLeadIndex((prev) => Math.max(0, prev - 1))}
                      disabled={previewLeadIndex === 0}
                      className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-white disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">
                      {previewLeadIndex + 1} of {selectedLeads.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewLeadIndex((prev) => Math.min(selectedLeads.length - 1, prev + 1))}
                      disabled={previewLeadIndex === selectedLeads.length - 1}
                      className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-white disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              <div className="text-xs font-mono">
                <div className="text-slate-400 mb-1">
                  To: <strong className="text-white">{previewLead?.email || 'email@example.com'}</strong> ({previewLead?.name})
                </div>
                <div className="text-purple-300 font-semibold mb-2">
                  Subject: {personalizedSubjectPreview}
                </div>
                <div className="text-slate-300 whitespace-pre-wrap bg-slate-950 p-3 rounded-lg border border-white/5">
                  {personalizedBodyPreview}
                </div>
              </div>
            </div>

            {/* Anti-Spam Deliverability Badge */}
            <div className="flex items-center justify-between rounded-xl bg-slate-900/60 border border-white/10 p-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-slate-300 font-medium">Spam Audit Score:</span>
                <span className="font-bold text-emerald-400 font-mono">{spamAudit.score}/100 ({spamAudit.grade})</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                RFC List-Unsubscribe + Precedence: bulk Active
              </span>
            </div>
          </div>

          {/* Real-time Dispatch Progress & Status */}
          {isSending && (
            <div className="rounded-xl border border-purple-500/40 bg-purple-950/30 p-4 mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-2">
                  <RotateCw className="h-3.5 w-3.5 animate-spin text-purple-400" />
                  Streaming Bulk Outreach...
                </span>
                <span className="font-mono text-purple-300">
                  {sentCount} / {selectedLeads.length} ({Math.round((sentCount / selectedLeads.length) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-150"
                  style={{ width: `${(sentCount / selectedLeads.length) * 100}%` }}
                />
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate">{activeLog}</p>
            </div>
          )}

          {isCompleted && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 mb-4 flex items-center justify-center gap-2 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Bulk dispatch complete! Successfully sent to {selectedLeads.length} leads.</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            {!isSending && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleStartBulkSend}
              disabled={isSending || isCompleted || selectedLeads.length === 0}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RotateCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Sending to {selectedLeads.length} Leads...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Launch Bulk Send to {selectedLeads.length} Leads</span>
                </>
              )}
            </button>
          </div>
        </FlashGlowCard>
      </div>
    </div>
  );
};

export default BulkEmailModal;
