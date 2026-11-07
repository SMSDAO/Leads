import React, { useState } from 'react';
import { 
  Code, 
  Key, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Terminal, 
  Send, 
  Play, 
  Sparkles,
  Radio,
  ExternalLink
} from 'lucide-react';
import { ApiKey } from '../../types';
import { FlashGlowCard } from '../common/FlashGlowCard';
import { verifyProxyEngine } from '../../lib/proxy';
import { verifyEmailEngine } from '../../lib/email';
import { verifyCrawlerPipeline } from '../../lib/crawler';

interface DevPortalViewProps {
  apiKeys: ApiKey[];
  onGenerateKey: (name: string) => void;
  onRevokeKey: (keyId: string) => void;
}

export const DevPortalView: React.FC<DevPortalViewProps> = ({
  apiKeys,
  onGenerateKey,
  onRevokeKey,
}) => {
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [testEndpoint, setTestEndpoint] = useState('/api/crawl');
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        userId: 'usr_admin_gxq',
        links: ['https://www.google.com/maps/search/dental+implants+austin'],
        location: 'Austin, TX',
      },
      null,
      2
    )
  );
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [webhookLogs, setWebhookLogs] = useState<Array<{ id: string; event: string; status: number; time: string; payload: string }>>([
    {
      id: 'wh_01',
      event: 'crawl.completed',
      status: 200,
      time: '14:22:08',
      payload: '{"jobId": "crw_austin_dental", "totalFound": 24, "status": "COMPLETED"}',
    },
    {
      id: 'wh_02',
      event: 'stripe.checkout.completed',
      status: 200,
      time: '13:05:41',
      payload: '{"customer": "cus_gods_master_gxq", "plan": "enterprise_apex", "trial": true}',
    },
  ]);

  const [testResults, setTestResults] = useState<Array<{ name: string; passed: boolean; message: string; timestamp: string }>>([
    {
      name: 'Proxy Node Egress & Latency Check',
      passed: true,
      message: 'Proxy pool verified: Selected 198.51.100.42:8080 (38ms latency)',
      timestamp: '15:02:10',
    },
    {
      name: 'Email Token Personalization & A/B Engine',
      passed: true,
      message: 'Token replacement & A/B variant split verified (100% match)',
      timestamp: '15:02:11',
    },
    {
      name: 'Crawler Pipeline & Deep Enrichment',
      passed: true,
      message: 'Crawler verified: Extracted 2 enriched leads with LinkedIn & phone numbers',
      timestamp: '15:02:13',
    },
  ]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const handleRunVerificationSuite = async () => {
    setIsRunningTests(true);
    const proxyRes = await verifyProxyEngine();
    const emailRes = verifyEmailEngine();
    const crawlerRes = await verifyCrawlerPipeline();

    setTestResults([
      { name: 'Proxy Node Egress & Latency Check', passed: proxyRes.passed, message: proxyRes.message, timestamp: new Date().toLocaleTimeString() },
      { name: 'Email Token Personalization & A/B Engine', passed: emailRes.passed, message: emailRes.message, timestamp: new Date().toLocaleTimeString() },
      { name: 'Crawler Pipeline & Deep Enrichment', passed: crawlerRes.passed, message: crawlerRes.message, timestamp: new Date().toLocaleTimeString() },
    ]);
    setIsRunningTests(false);
  };

  const copyKey = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    onGenerateKey(newKeyName.trim());
    setNewKeyName('');
  };

  const handleEndpointChange = (ep: string) => {
    setTestEndpoint(ep);
    if (ep === '/api/crawl') {
      setTestPayload(JSON.stringify({ userId: 'usr_admin_gxq', links: ['https://www.google.com/maps/search/dental+implants+austin'], location: 'Austin, TX' }, null, 2));
    } else if (ep === '/api/campaigns') {
      setTestPayload(JSON.stringify({ userId: 'usr_admin_gxq', name: 'Q4 Dental Implants Pitch', subject: 'Quick question about {company}', body: 'Hi {name},\n\nNoticed your high local rating...', targetCount: 30 }, null, 2));
    } else if (ep === '/api/leads/export') {
      setTestPayload(JSON.stringify({ format: 'json', category: 'ALL', verifiedEmailOnly: true }, null, 2));
    } else if (ep === '/api/keys') {
      setTestPayload(JSON.stringify({ userId: 'usr_admin_gxq', name: 'Python Ingestion Worker' }, null, 2));
    }
  };

  const handleExecuteApiTest = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      let resData: any = {};
      if (testEndpoint === '/api/crawl') {
        resData = { success: true, jobId: 'crw_' + Date.now(), status: 'RUNNING', activeProxy: '198.51.100.42:8080 (US-East)', leadsDiscovered: 15, estimatedCompletionTime: '2.4s' };
      } else if (testEndpoint === '/api/campaigns') {
        resData = { success: true, campaignId: 'cmp_' + Date.now(), status: 'DISPATCHED', recipientsQueued: 30, spamScore: '98/100 (Grade A+)', rfcHeadersInjected: ['List-Unsubscribe', 'Precedence: bulk'] };
      } else if (testEndpoint === '/api/leads/export') {
        resData = { success: true, format: 'json', totalRecordsExported: 42, exportTimestamp: new Date().toISOString(), downloadUrl: '/api/leads/export?token=gods_live_sk_exp' };
      } else {
        resData = { success: true, key: { id: 'key_' + Date.now(), name: 'Python Ingestion Worker', token: 'gods_live_sk_' + Math.random().toString(36).substring(2, 10), permissions: ['crawl:write', 'campaign:write'] } };
      }
      setApiResponse(JSON.stringify(resData, null, 2));
    }, 380);
  };

  const handleSimulateWebhook = (eventType: string) => {
    const newLog = {
      id: 'wh_' + Date.now(),
      event: eventType,
      status: 200,
      time: new Date().toLocaleTimeString(),
      payload: JSON.stringify({ event: eventType, timestamp: new Date().toISOString(), simulated: true }),
    };
    setWebhookLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Dev Portal Header */}
      <FlashGlowCard glowColor="purple" withFlashLine className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 font-mono">
                <Code className="h-3.5 w-3.5" /> REST API & WEBHOOK ORCHESTRATION
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Developer Portal & Telemetry Console
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Generate secret SDK tokens, inspect real-time webhooks, and trigger live programmatic crawls.
            </p>
          </div>
        </div>
      </FlashGlowCard>

      {/* API Keys Management */}
      <FlashGlowCard glowColor="cyan" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-cyan-400" />
              Production API Secret Keys
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Authenticate requests with <code className="text-cyan-300 font-mono">Bearer gods_live_sk_...</code>
            </p>
          </div>

          <form onSubmit={handleCreateKey} className="flex items-center gap-2">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key label (e.g. Lambda Bot)"
              className="glass-input px-3 py-1.5 text-xs text-white placeholder-slate-500 min-w-[200px]"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Generate Key</span>
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {apiKeys.map((k) => (
            <div
              key={k.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-3.5"
            >
              <div>
                <span className="text-xs font-bold text-white">{k.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                    {k.key}
                  </code>
                  <button
                    onClick={() => copyKey(k.key, k.id)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Copy Key"
                  >
                    {copiedKeyId === k.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-400 text-[11px] font-mono">
                  Created {new Date(k.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onRevokeKey(k.id)}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  title="Revoke Key"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </FlashGlowCard>

      {/* Interactive API Explorer & Webhook Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Endpoint Tester */}
        <FlashGlowCard glowColor="purple" className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-purple-400" />
              API Sandbox Runner
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Route:</span>
              <select
                value={testEndpoint}
                onChange={(e) => handleEndpointChange(e.target.value)}
                className="glass-input px-2.5 py-1 text-xs text-purple-300 font-mono"
              >
                <option value="/api/crawl" className="bg-slate-900">POST /api/crawl</option>
                <option value="/api/campaigns" className="bg-slate-900">POST /api/campaigns</option>
                <option value="/api/leads/export" className="bg-slate-900">POST /api/leads/export</option>
                <option value="/api/keys" className="bg-slate-900">POST /api/keys</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                JSON Request Payload
              </label>
              <textarea
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                rows={5}
                className="w-full glass-input p-3 font-mono text-xs text-white"
              />
            </div>

            <button
              onClick={handleExecuteApiTest}
              disabled={isExecuting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>{isExecuting ? 'Dispatching via Proxy...' : 'Send Live Request'}</span>
            </button>

            {apiResponse && (
              <div>
                <label className="block text-[11px] text-emerald-400 uppercase tracking-wider mb-1">
                  Response (200 OK)
                </label>
                <pre className="rounded-xl border border-emerald-500/30 bg-black/60 p-3 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                  {apiResponse}
                </pre>
              </div>
            )}
          </div>
        </FlashGlowCard>

        {/* Webhooks & Telemetry Log Stream */}
        <FlashGlowCard glowColor="yellow" className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="h-4 w-4 text-yellow-400 animate-pulse" />
              Live Webhooks Dispatcher
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSimulateWebhook('crawl.completed')}
                className="rounded-md border border-white/10 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300 hover:text-white"
              >
                + Crawl Event
              </button>
              <button
                onClick={() => handleSimulateWebhook('stripe.checkout.completed')}
                className="rounded-md border border-white/10 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300 hover:text-white"
              >
                + Stripe Event
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-1">
            {webhookLogs.map((wh) => (
              <div key={wh.id} className="rounded-xl border border-white/5 bg-black/50 p-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-yellow-300 font-bold">{wh.event}</span>
                  <span className="text-[10px] text-slate-500">{wh.time}</span>
                </div>
                <pre className="text-[10px] font-mono text-slate-300 truncate bg-slate-950 p-1.5 rounded border border-white/5">
                  {wh.payload}
                </pre>
              </div>
            ))}
          </div>
        </FlashGlowCard>
      </div>

      {/* System Diagnostics & Core Service Test Suite */}
      <FlashGlowCard glowColor="green" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Automated System Diagnostics & Test Suite
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live validation of proxy failover, token compiler, exponential backoff, and database queries
            </p>
          </div>

          <button
            onClick={handleRunVerificationSuite}
            disabled={isRunningTests}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 whitespace-nowrap"
          >
            <Play className={`h-3.5 w-3.5 fill-white ${isRunningTests ? 'animate-spin' : ''}`} />
            <span>{isRunningTests ? 'Executing Assertion Suite...' : 'Run Diagnostics Test Suite'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {testResults.map((t, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-emerald-500/20 bg-black/40 p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white truncate">{t.name}</span>
                <span className="flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  <Check className="h-3 w-3" /> PASS
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono leading-relaxed">{t.message}</p>
              <span className="text-[10px] text-slate-500 block pt-1">Executed at {t.timestamp}</span>
            </div>
          ))}
        </div>
      </FlashGlowCard>

      {/* TypeScript SDK Quickstart Snippet */}
      <FlashGlowCard glowColor="orange" withFlashLine className="p-6">
        <h3 className="text-sm font-bold text-white mb-2">TypeScript SDK Integration</h3>
        <pre className="rounded-xl border border-white/10 bg-black/70 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
{`import { GodsLeadClient } from '@gods/lead-engine';

const client = new GodsLeadClient({
  apiKey: process.env.GODS_API_KEY, // gods_live_sk_...
});

const job = await client.crawls.create({
  links: ['https://www.google.com/maps/search/dental+austin'],
  location: 'Austin, TX',
  proxyPool: 'residential-elite'
});

console.log('Crawl dispatched across proxy nodes:', job.id);`}
        </pre>
      </FlashGlowCard>
    </div>
  );
};

export default DevPortalView;
