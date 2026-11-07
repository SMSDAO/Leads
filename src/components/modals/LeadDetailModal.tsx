import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  ExternalLink, 
  Check, 
  Copy, 
  Send,
  Linkedin,
  Facebook,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { BusinessLead } from '../../types';
import { FlashGlowCard } from '../common/FlashGlowCard';

interface LeadDetailModalProps {
  lead: BusinessLead | null;
  onClose: () => void;
  onAddToCampaign: (lead: BusinessLead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onAddToCampaign,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!lead) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl">
        <FlashGlowCard glowColor="purple" withFlashLine className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-300">
                  {lead.category || 'Business'}
                </span>
                {lead.verifiedEmail && (
                  <span className="flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Email
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {lead.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Rating & Location Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
            <div className="rounded-xl border border-white/10 bg-black/40 p-3">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Google Rating</span>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-lg font-bold text-white tabular-nums">{lead.rating || 'N/A'}</span>
                <span className="text-xs text-slate-400 font-mono">({lead.reviewsCount || 0} reviews)</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-3">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Enrichment Status</span>
              <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> High Confidence
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-3 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Verification Egress</span>
              <span className="text-xs font-mono text-cyan-300">Residential Pool #42</span>
            </div>
          </div>

          {/* Contact Details List */}
          <div className="space-y-3 mb-6">
            {/* Address */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Address</span>
                  <span className="text-xs font-medium text-slate-200">{lead.address || 'Address not listed'}</span>
                </div>
              </div>
              {lead.address && (
                <button
                  onClick={() => copyToClipboard(lead.address!, 'address')}
                  className="rounded p-1.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Copy address"
                >
                  {copiedField === 'address' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              )}
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Phone</span>
                  <span className="text-xs font-mono font-medium text-slate-200">{lead.phone || 'Phone not listed'}</span>
                </div>
              </div>
              {lead.phone && (
                <button
                  onClick={() => copyToClipboard(lead.phone!, 'phone')}
                  className="rounded p-1.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Copy phone"
                >
                  {copiedField === 'phone' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Decision Maker Email</span>
                  <span className="text-xs font-mono font-medium text-slate-200">{lead.email || 'Deep scanning...'}</span>
                </div>
              </div>
              {lead.email && (
                <button
                  onClick={() => copyToClipboard(lead.email!, 'email')}
                  className="rounded p-1.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Copy email"
                >
                  {copiedField === 'email' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              )}
            </div>

            {/* Operating Hours */}
            {lead.operatingHours && (
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Operating Hours</span>
                    <span className="text-xs font-mono font-medium text-slate-200">{lead.operatingHours}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Social Accounts & Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {lead.socials?.linkedin && (
                <a
                  href={lead.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  <span>LinkedIn Profile</span>
                </a>
              )}
              {lead.socials?.facebook && (
                <a
                  href={lead.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition-all"
                >
                  <Facebook className="h-3.5 w-3.5" />
                  <span>Facebook</span>
                </a>
              )}
              {lead.website && (
                <a
                  href={lead.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-all"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Website</span>
                  <ExternalLink className="h-3 w-3 ml-0.5" />
                </a>
              )}
              {lead.mapsUrl && (
                <a
                  href={lead.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="h-3 w-3 ml-0.5" />
                </a>
              )}
            </div>

            {/* Tags */}
            {lead.tags && lead.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {lead.tags.map((t, idx) => (
                  <span key={idx} className="rounded border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] text-slate-400">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onAddToCampaign(lead);
                onClose();
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_28px_rgba(168,85,247,0.6)] transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Add to Outreach Sequence</span>
            </button>
          </div>
        </FlashGlowCard>
      </div>
    </div>
  );
};

export default LeadDetailModal;
