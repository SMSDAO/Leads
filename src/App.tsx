import React, { useState } from 'react';
import { 
  User, 
  Role, 
  SubscriptionStatus, 
  BusinessLead, 
  CrawlJob, 
  EmailCampaign, 
  ProxyNode, 
  ApiKey, 
  ScrapeLogEntry 
} from './types';
import { 
  INITIAL_USER, 
  INITIAL_USERS_LIST, 
  INITIAL_LEADS, 
  INITIAL_CRAWL_JOBS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_PROXY_NODES, 
  INITIAL_API_KEYS 
} from './lib/store';
import { PRICING_TIERS, PlanTier } from './lib/stripe';
import { Navbar } from './components/common/Navbar';
import { LandingView } from './components/landing/LandingView';
import { DashboardView } from './components/dashboard/DashboardView';
import { CampaignsView } from './components/campaigns/CampaignsView';
import { AdminView } from './components/admin/AdminView';
import { DevPortalView } from './components/dev/DevPortalView';
import { PricingView } from './components/pricing/PricingView';
import { CheckoutModal } from './components/modals/CheckoutModal';

export default function App() {
  // Navigation & User Context
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS_LIST);

  // Core Data Collections
  const [leads, setLeads] = useState<BusinessLead[]>(INITIAL_LEADS);
  const [crawlJobs, setCrawlJobs] = useState<CrawlJob[]>(INITIAL_CRAWL_JOBS);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(INITIAL_CAMPAIGNS);
  const [proxyNodes, setProxyNodes] = useState<ProxyNode[]>(INITIAL_PROXY_NODES);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(INITIAL_API_KEYS);

  // Live Scrape Execution State
  const [activeCrawl, setActiveCrawl] = useState<CrawlJob | null>(null);
  const [crawlLogs, setCrawlLogs] = useState<ScrapeLogEntry[]>([]);
  const [dispatchingCampaignId, setDispatchingCampaignId] = useState<string | null>(null);

  // Testing Proxies state
  const [isTestingProxies, setIsTestingProxies] = useState(false);

  // Checkout Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedCheckoutTierId, setSelectedCheckoutTierId] = useState<string>('pro');

  // RBAC Role Switcher
  const handleSwitchUserRole = (role: Role, email: string) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
    } else {
      const newUser: User = {
        id: 'usr_' + Date.now(),
        name: role === 'ADMIN' ? 'Master Executive Admin' : 'Lead Operator',
        email,
        role,
        status: 'ACTIVE',
        stripeId: null,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
    }
  };

  // Launch a new crawl
  const handleStartCrawl = (query: string, location: string) => {
    const activeProxy = proxyNodes.find((p) => p.isActive) || proxyNodes[0];
    const proxyDesc = `${activeProxy.host}:${activeProxy.port} (${activeProxy.location})`;

    const newJob: CrawlJob = {
      id: 'crw_' + Date.now(),
      userId: currentUser.id,
      targetUrl: query,
      location: location || 'United States',
      status: 'RUNNING',
      totalFound: 0,
      activeProxy: proxyDesc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setActiveCrawl(newJob);
    setCrawlJobs((prev) => [newJob, ...prev]);

    // Initial Logs
    const initialLogs: ScrapeLogEntry[] = [
      {
        id: 'log_1',
        timestamp: new Date().toLocaleTimeString(),
        level: 'proxy',
        message: `Dispatching egress proxy: ${proxyDesc} (Protocol: ${activeProxy.protocol.toUpperCase()})`,
      },
      {
        id: 'log_2',
        timestamp: new Date().toLocaleTimeString(),
        level: 'info',
        message: `Routing Google Maps Search: "${query}" in "${location}"`,
      },
    ];
    setCrawlLogs(initialLogs);

    // Step-by-step extraction animation
    setTimeout(() => {
      setCrawlLogs((prev) => [
        {
          id: 'log_3',
          timestamp: new Date().toLocaleTimeString(),
          level: 'info',
          message: 'TLS 1.3 handshake verified. Anti-bot fingerprint disguised.',
        },
        ...prev,
      ]);
    }, 700);

    setTimeout(() => {
      setCrawlLogs((prev) => [
        {
          id: 'log_4',
          timestamp: new Date().toLocaleTimeString(),
          level: 'success',
          message: 'Parsed 3 business clusters from Google Maps viewport DOM.',
        },
        ...prev,
      ]);
    }, 1400);

    setTimeout(() => {
      // Generate 3 high-quality simulated leads
      const locStr = location.split('(')[0].trim() || 'Austin, TX';
      const cleanKeyword = query.replace(/https?:\/\//, '').split('/')[0] || 'Specialists';

      const generatedLeads: BusinessLead[] = [
        {
          id: 'lead_' + Date.now() + '_1',
          crawlId: newJob.id,
          name: `Vanguard ${cleanKeyword} Center`,
          category: query.includes('Dental') ? 'Dental Clinic' : query.includes('Roofing') ? 'Roofing Contractor' : 'Specialist Group',
          address: `1040 Capital Blvd, ${locStr}`,
          phone: `+1 (512) ${Math.floor(200 + Math.random() * 700)}-${Math.floor(1000 + Math.random() * 9000)}`,
          email: `contact@vanguard-${locStr.slice(0, 2).toLowerCase()}.org`,
          website: `https://vanguard-${locStr.slice(0, 2).toLowerCase()}.org`,
          rating: 4.9,
          reviewsCount: Math.floor(120 + Math.random() * 300),
          mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(query + ' ' + locStr)}`,
          verifiedEmail: true,
          socials: { linkedin: 'https://linkedin.com/company/vanguard-center' },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'lead_' + Date.now() + '_2',
          crawlId: newJob.id,
          name: `Apex Precision ${cleanKeyword}`,
          category: query.includes('Dental') ? 'Orthodontics' : query.includes('Roofing') ? 'Commercial Roofing' : 'Consulting Firm',
          address: `450 Congress Ave, Ste 800, ${locStr}`,
          phone: `+1 (512) ${Math.floor(200 + Math.random() * 700)}-${Math.floor(1000 + Math.random() * 9000)}`,
          email: `info@apexprecision-${locStr.slice(0, 2).toLowerCase()}.com`,
          website: `https://apexprecision-${locStr.slice(0, 2).toLowerCase()}.com`,
          rating: 4.8,
          reviewsCount: Math.floor(80 + Math.random() * 150),
          mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(query + ' ' + locStr)}`,
          verifiedEmail: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'lead_' + Date.now() + '_3',
          crawlId: newJob.id,
          name: `Premier ${cleanKeyword} Experts`,
          category: query.includes('Dental') ? 'Cosmetic Dentist' : 'General Contractors',
          address: `7200 Tech Ridge Pkwy, ${locStr}`,
          phone: `+1 (512) ${Math.floor(200 + Math.random() * 700)}-${Math.floor(1000 + Math.random() * 9000)}`,
          email: `team@premier${cleanKeyword.toLowerCase().replace(/[^a-z]/g, '')}.com`,
          website: `https://premier${cleanKeyword.toLowerCase().replace(/[^a-z]/g, '')}.com`,
          rating: 4.7,
          reviewsCount: Math.floor(65 + Math.random() * 90),
          mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(query + ' ' + locStr)}`,
          verifiedEmail: true,
          createdAt: new Date().toISOString(),
        },
      ];

      setLeads((prev) => [...generatedLeads, ...prev]);

      setCrawlLogs((prev) => [
        {
          id: 'log_5',
          timestamp: new Date().toLocaleTimeString(),
          level: 'success',
          message: `Deep crawler enriched 3 decision maker emails & phone numbers. Job completed.`,
        },
        ...prev,
      ]);

      setCrawlJobs((prev) =>
        prev.map((j) => (j.id === newJob.id ? { ...j, status: 'COMPLETED', totalFound: 3 } : j))
      );

      setActiveCrawl(null);
    }, 2400);
  };

  // Delete lead
  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // Add lead to campaign
  const handleAddToCampaign = (lead: BusinessLead) => {
    if (campaigns.length > 0) {
      setCampaigns((prev) =>
        prev.map((c, idx) => (idx === 0 ? { ...c, targetCount: c.targetCount + 1 } : c))
      );
      setCurrentTab('campaigns');
    }
  };

  // Create campaign
  const handleCreateCampaign = (campData: { name: string; subject: string; body: string; targetCount: number }) => {
    const newCamp: EmailCampaign = {
      id: 'cmp_' + Date.now(),
      userId: currentUser.id,
      name: campData.name,
      subject: campData.subject,
      body: campData.body,
      status: 'DRAFT',
      sentCount: 0,
      targetCount: campData.targetCount,
      openRate: 48.0,
      clickRate: 18.5,
      createdAt: new Date().toISOString(),
    };
    setCampaigns((prev) => [newCamp, ...prev]);
  };

  // Dispatch campaign
  const handleDispatchCampaign = (campaignId: string) => {
    setDispatchingCampaignId(campaignId);

    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: 'SENDING' } : c))
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id === campaignId) {
            const nextSent = Math.min(c.targetCount, c.sentCount + 15);
            return {
              ...c,
              sentCount: nextSent,
              status: nextSent >= c.targetCount ? 'COMPLETED' : 'SENDING',
            };
          }
          return c;
        })
      );

      if (progress >= 100) {
        clearInterval(interval);
        setDispatchingCampaignId(null);
      }
    }, 350);
  };

  // User management overrides
  const handleUpdateUserRole = (userId: string, newRole: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, role: newRole }));
    }
  };

  const handleUpdateUserStatus = (userId: string, newStatus: SubscriptionStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Toggle Proxy Active
  const handleToggleProxyActive = (proxyId: string) => {
    setProxyNodes((prev) =>
      prev.map((p) => (p.id === proxyId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Test Proxy Latencies
  const handleTestProxyLatencies = () => {
    setIsTestingProxies(true);
    setTimeout(() => {
      setProxyNodes((prev) =>
        prev.map((p) => ({
          ...p,
          latencyMs: Math.floor(28 + Math.random() * 55),
        }))
      );
      setIsTestingProxies(false);
    }, 900);
  };

  // Add Proxy Node
  const handleAddProxyNode = (node: { host: string; port: number; protocol: 'http' | 'https' | 'socks5'; location: string }) => {
    const newNode: ProxyNode = {
      id: 'prx_' + Date.now(),
      host: node.host,
      port: node.port,
      protocol: node.protocol,
      location: node.location,
      isActive: true,
      latencyMs: Math.floor(35 + Math.random() * 40),
      createdAt: new Date().toISOString(),
    };
    setProxyNodes((prev) => [newNode, ...prev]);
  };

  // Generate API Key
  const handleGenerateKey = (name: string) => {
    const newKey: ApiKey = {
      id: 'key_' + Date.now(),
      userId: currentUser.id,
      name,
      key: 'gods_live_sk_' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12),
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    };
    setApiKeys((prev) => [newKey, ...prev]);
  };

  // Revoke API Key
  const handleRevokeKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
  };

  // Open Checkout
  const handleOpenCheckout = (tierId: string = 'pro') => {
    setSelectedCheckoutTierId(tierId);
    setCheckoutModalOpen(true);
  };

  // Trial activated
  const handleCheckoutSuccess = (tier: PlanTier) => {
    setCurrentUser((prev) => ({
      ...prev,
      status: 'ACTIVE',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05060b] text-slate-100 cyber-grid-bg relative selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onSwitchUserRole={handleSwitchUserRole}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentTab === 'landing' && (
          <LandingView
            onGoToScanner={() => setCurrentTab('dashboard')}
            onOpenCheckout={handleOpenCheckout}
            onGoToPricing={() => setCurrentTab('pricing')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            leads={leads}
            crawlJobs={crawlJobs}
            proxyNodes={proxyNodes}
            onStartCrawl={handleStartCrawl}
            onDeleteLead={handleDeleteLead}
            onAddToCampaign={handleAddToCampaign}
            activeCrawl={activeCrawl}
            crawlLogs={crawlLogs}
          />
        )}

        {currentTab === 'campaigns' && (
          <CampaignsView
            campaigns={campaigns}
            leads={leads}
            onCreateCampaign={handleCreateCampaign}
            onDispatchCampaign={handleDispatchCampaign}
            dispatchingCampaignId={dispatchingCampaignId}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            users={users}
            proxies={proxyNodes}
            onUpdateUserRole={handleUpdateUserRole}
            onUpdateUserStatus={handleUpdateUserStatus}
            onToggleProxyActive={handleToggleProxyActive}
            onTestProxyLatencies={handleTestProxyLatencies}
            onAddProxyNode={handleAddProxyNode}
            isTestingProxies={isTestingProxies}
          />
        )}

        {currentTab === 'dev' && (
          <DevPortalView
            apiKeys={apiKeys}
            onGenerateKey={handleGenerateKey}
            onRevokeKey={handleRevokeKey}
          />
        )}

        {currentTab === 'pricing' && (
          <PricingView
            onSelectTier={handleOpenCheckout}
          />
        )}
      </main>

      {/* Checkout & Trial Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        initialTierId={selectedCheckoutTierId}
        userEmail={currentUser.email}
        onClose={() => setCheckoutModalOpen(false)}
        onConfirmSuccess={handleCheckoutSuccess}
      />

      {/* Cyber Footer */}
      <footer className="border-t border-white/10 bg-[#04060c] py-8 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-cyber font-black text-white text-sm">GODS LEAD ENGINE</span>
            <span className="text-slate-600">·</span>
            <span className="text-[11px] font-mono text-purple-400">v2.4-ENTERPRISE-PROD</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <button onClick={() => setCurrentTab('landing')} className="hover:text-white transition-colors">Overview</button>
            <button onClick={() => setCurrentTab('dashboard')} className="hover:text-white transition-colors">Scanner</button>
            <button onClick={() => setCurrentTab('campaigns')} className="hover:text-white transition-colors">Outreach</button>
            <button onClick={() => setCurrentTab('dev')} className="hover:text-white transition-colors">Developer API</button>
            <button onClick={() => setCurrentTab('admin')} className="hover:text-white transition-colors">Admin Hub</button>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Authorized: {currentUser.email}
          </div>
        </div>
      </footer>
    </div>
  );
}
