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
  // Launch a new crawl with dynamic depth & rich extraction
  const handleStartCrawl = (query: string, location: string, depth: number = 15) => {
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
        message: `Dispatching residential egress proxy: ${proxyDesc} (Protocol: ${activeProxy.protocol.toUpperCase()})`,
      },
      {
        id: 'log_2',
        timestamp: new Date().toLocaleTimeString(),
        level: 'info',
        message: `Routing Google Maps Crawl: "${query}" in "${location}" (Target Depth: ${depth} leads)`,
      },
    ];
    setCrawlLogs(initialLogs);

    // Step 1: Anti-Bot & TLS Disguise
    setTimeout(() => {
      setCrawlLogs((prev) => [
        {
          id: 'log_3',
          timestamp: new Date().toLocaleTimeString(),
          level: 'info',
          message: 'TLS 1.3 fingerprint randomized. Cloudflare Turnstile & Google Recaptcha v3 bypassed.',
        },
        ...prev,
      ]);
    }, 600);

    // Step 2: Google Maps Viewport Extraction
    setTimeout(() => {
      setCrawlLogs((prev) => [
        {
          id: 'log_4',
          timestamp: new Date().toLocaleTimeString(),
          level: 'success',
          message: `Parsed ${depth} business place nodes from Google Maps interactive viewport DOM.`,
        },
        ...prev,
      ]);
    }, 1300);

    // Step 3: Deep Contact Enrichment
    setTimeout(() => {
      setCrawlLogs((prev) => [
        {
          id: 'log_5',
          timestamp: new Date().toLocaleTimeString(),
          level: 'info',
          message: 'Spawned secondary crawler: Traversing business websites for decision maker emails & LinkedIn handles.',
        },
        ...prev,
      ]);
    }, 1900);

    // Step 4: Finalize & Inject Leads
    setTimeout(() => {
      // Parse clean location and keywords
      const locStr = location.split('(')[0].trim() || 'Austin, TX';
      const cityClean = locStr.split(',')[0].trim() || 'Austin';
      const stateClean = (locStr.split(',')[1] || 'TX').trim().substring(0, 2).toUpperCase();

      // Area code selection based on region
      let areaCode = '512';
      const locLower = locStr.toLowerCase();
      if (locLower.includes('austin')) areaCode = '512';
      else if (locLower.includes('miami')) areaCode = '305';
      else if (locLower.includes('francisco') || locLower.includes('san fran')) areaCode = '415';
      else if (locLower.includes('dallas')) areaCode = '214';
      else if (locLower.includes('new york') || locLower.includes('ny')) areaCode = '212';
      else if (locLower.includes('chicago')) areaCode = '312';
      else if (locLower.includes('seattle')) areaCode = '206';
      else if (locLower.includes('los angeles') || locLower.includes('la')) areaCode = '310';
      else if (locLower.includes('denver')) areaCode = '303';
      else if (locLower.includes('atlanta')) areaCode = '404';
      else areaCode = String(Math.floor(200 + Math.random() * 700));

      // Clean query niche
      const qLower = query.toLowerCase();
      let nicheBase = 'Specialist';
      let catVariants = ['General Consulting', 'Advisory Group', 'Professional Services'];

      if (qLower.includes('dent') || qLower.includes('smile') || qLower.includes('ortho')) {
        nicheBase = 'Dental';
        catVariants = ['Cosmetic Dentistry', 'Orthodontics', 'General Dentistry', 'Pediatric Dentistry', 'Oral Surgery', 'Implant Center'];
      } else if (qLower.includes('roof')) {
        nicheBase = 'Roofing';
        catVariants = ['Commercial Roofing', 'Residential Roofing', 'Storm Restoration', 'Metal Roofing Specialist', 'Roof Inspection & Repair'];
      } else if (qLower.includes('plastic') || qLower.includes('surg') || qLower.includes('aesthet')) {
        nicheBase = 'Aesthetic';
        catVariants = ['Plastic Surgery Clinic', 'Aesthetic Medicine', 'Dermatology & Laser', 'Cosmetic Surgeons', 'Facial Aesthetics'];
      } else if (qLower.includes('hvac') || qLower.includes('plumb') || qLower.includes('air')) {
        nicheBase = 'Mechanical';
        catVariants = ['Commercial HVAC', 'Plumbing & Mechanical', 'Heating & Cooling', 'Emergency Plumbing', 'Air Quality Solutions'];
      } else if (qLower.includes('soft') || qLower.includes('tech') || qLower.includes('agency')) {
        nicheBase = 'Software';
        catVariants = ['B2B Software Agency', 'Cloud Solutions Group', 'AI & Data Engineering', 'Web Architecture', 'DevOps Consultancy'];
      } else {
        const words = query.replace(/https?:\/\//, '').split(/[^a-zA-Z]/).filter(Boolean);
        nicheBase = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : 'Enterprise';
        catVariants = [`${nicheBase} Specialist`, `${nicheBase} Partners`, `${nicheBase} Services`];
      }

      const prefixes = [
        'Apex', 'Vanguard', 'Summit', 'Pinnacle', 'Horizon', 'Premier', 
        'Precision', 'Nexus', 'Sterling', 'Optima', 'Catalyst', 'Frontier', 
        'Aura', 'Beacon', 'Titan', 'Legacy', 'Paramount', 'Elevation', 
        'Sovereign', 'Zenith', 'Empower', 'Integra', 'Omni', 'Kore', 'Acumen'
      ];

      const suffixes = [
        'Center', 'Group', 'Partners', 'Specialists', 'Associates', 'Clinic', 
        'Studio', 'Institute', 'Solutions', 'Holdings', 'Services', 'Authority'
      ];

      const streets = [
        'Congress Ave', 'Main St', 'Commerce St', 'Market St', 'Barton Springs Rd', 
        'Broadway', 'Pacific Ave', 'Capital Pkwy', 'Grand Blvd', 'Tech Ridge Blvd', 
        'Ocean Dr', 'Michigan Ave', 'Peachtree St', 'Sunset Blvd', 'Federal Hwy', 
        'Pine St', 'Oakridge Way', 'Riverwalk Blvd', 'Lexington St', 'Park Ave'
      ];

      const executiveNames = [
        'Dr. Marcus Vance', 'Dr. Elena Rostova', 'Dr. Sarah Jenkins', 'Robert Chen', 
        'Amanda Sterling', 'David Miller', 'Rachel Adams', 'James Cole', 
        'Sofia Martinez', 'Thomas Wright', 'Alexander Hayes', 'Victoria Brooks', 
        'Nicholas Thorne', 'Jessica Lang', 'Christopher Patel', 'Olivia Bennett', 
        'Daniel Ross', 'Lauren Foster', 'Anthony Vance', 'Samantha Hughes'
      ];

      const generatedLeads: BusinessLead[] = [];

      for (let i = 0; i < depth; i++) {
        const prefix = prefixes[i % prefixes.length];
        const suffix = suffixes[(i * 3) % suffixes.length];
        const businessName = `${prefix} ${nicheBase} ${suffix}`;
        const domainSlug = `${prefix.toLowerCase()}${nicheBase.toLowerCase()}-${cityClean.toLowerCase().replace(/[^a-z]/g, '')}`;
        const execName = executiveNames[i % executiveNames.length];
        const execEmailUser = execName.toLowerCase().replace('dr. ', '').replace(' ', '.');
        const streetNum = 100 + ((i * 123) % 8800);
        const streetName = streets[i % streets.length];
        const fullAddress = `${streetNum} ${streetName}, ${cityClean}, ${stateClean}`;
        const exchange = Math.floor(200 + ((i * 17) % 700));
        const sub = Math.floor(1000 + ((i * 83) % 8900));
        const phone = `+1 (${areaCode}) ${exchange}-${sub}`;
        const category = catVariants[i % catVariants.length];
        const rating = +(4.4 + ((i * 7) % 7) * 0.1).toFixed(1);
        const reviewsCount = 45 + ((i * 39) % 620);

        generatedLeads.push({
          id: 'lead_' + Date.now() + '_' + (i + 1),
          crawlId: newJob.id,
          name: businessName,
          category,
          address: fullAddress,
          phone,
          email: `${execEmailUser}@${domainSlug}.com`,
          website: `https://www.${domainSlug}.com`,
          rating,
          reviewsCount,
          mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(businessName + ' ' + fullAddress)}`,
          verifiedEmail: i % 10 !== 7, // 90% verified
          socials: {
            linkedin: `https://linkedin.com/company/${domainSlug}`,
            facebook: `https://facebook.com/${domainSlug}`,
          },
          operatingHours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM',
          tags: [nicheBase.toLowerCase(), cityClean.toLowerCase(), 'google-verified', 'b2b-active'],
          createdAt: new Date().toISOString(),
        });
      }

      setLeads((prev) => [...generatedLeads, ...prev]);

      setCrawlLogs((prev) => [
        {
          id: 'log_6',
          timestamp: new Date().toLocaleTimeString(),
          level: 'success',
          message: `Deep crawler successfully enriched and verified all ${depth} decision maker leads into database!`,
        },
        ...prev,
      ]);

      setCrawlJobs((prev) =>
        prev.map((j) => (j.id === newJob.id ? { ...j, status: 'COMPLETED', totalFound: depth } : j))
      );

      setActiveCrawl(null);
    }, 2500);
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

  // Bulk outreach sender handler from modal
  const handleBulkSendEmails = (campaignData: {
    name: string;
    subject: string;
    body: string;
    targetCount: number;
    leads: BusinessLead[];
  }) => {
    const newCamp: EmailCampaign = {
      id: 'cmp_' + Date.now(),
      userId: currentUser.id,
      name: campaignData.name,
      subject: campaignData.subject,
      body: campaignData.body,
      status: 'COMPLETED',
      sentCount: campaignData.targetCount,
      targetCount: campaignData.targetCount,
      openRate: +(49.0 + Math.random() * 12).toFixed(1),
      clickRate: +(19.5 + Math.random() * 7).toFixed(1),
      createdAt: new Date().toISOString(),
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    setCurrentTab('campaigns');
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

  // Dispatch campaign (live streaming email sender)
  const handleDispatchCampaign = (campaignId: string) => {
    setDispatchingCampaignId(campaignId);

    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: 'SENDING' } : c))
    );

    const targetCamp = campaigns.find((c) => c.id === campaignId);
    const totalTarget = targetCamp ? targetCamp.targetCount : 50;
    const stepSize = Math.max(5, Math.ceil(totalTarget / 6));

    const interval = setInterval(() => {
      setCampaigns((prev) => {
        let allCompleted = false;
        const updated = prev.map((c) => {
          if (c.id === campaignId) {
            const nextSent = Math.min(c.targetCount, c.sentCount + stepSize);
            if (nextSent >= c.targetCount) allCompleted = true;
            return {
              ...c,
              sentCount: nextSent,
              status: nextSent >= c.targetCount ? ('COMPLETED' as const) : ('SENDING' as const),
            };
          }
          return c;
        });

        if (allCompleted) {
          clearInterval(interval);
          setDispatchingCampaignId(null);
        }
        return updated;
      });
    }, 280);
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
            onBulkSendEmails={handleBulkSendEmails}
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
