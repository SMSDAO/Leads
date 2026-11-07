export interface PlanTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  description: string;
  leadQuota: string;
  proxyRotation: string;
  outreachLimit: string;
  support: string;
  stripePriceId: string;
  popular?: boolean;
}

export const PRICING_TIERS: PlanTier[] = [
  {
    id: 'starter',
    name: 'Cyber Starter',
    price: 49,
    interval: 'month',
    description: 'For solo growth operators & boutique lead generation scouts.',
    leadQuota: '5,000 Verified Leads / mo',
    proxyRotation: '50 Shared Dynamic Residential Nodes',
    outreachLimit: '1,500 Outreach Emails / mo',
    support: 'Community & Standard SLA',
    stripePriceId: 'price_starter_gods_lead_monthly',
  },
  {
    id: 'pro',
    name: 'Enterprise Apex',
    price: 149,
    interval: 'month',
    description: 'For high-velocity B2B agencies & automated sales teams.',
    leadQuota: '35,000 Verified Leads / mo',
    proxyRotation: 'Unlimited Dedicated VPN + Elite Anti-Bot Nodes',
    outreachLimit: '15,000 Outreach Emails / mo',
    support: 'Priority VIP & Slack Dedicated Channel',
    stripePriceId: 'price_pro_gods_lead_monthly',
    popular: true,
  },
  {
    id: 'gods',
    name: 'Gods Master Engine',
    price: 399,
    interval: 'month',
    description: 'Full unthrottled scraper cluster, custom webhooks & API scale.',
    leadQuota: 'Unlimited Leads & Realtime AI Scraping',
    proxyRotation: 'Dedicated Private Proxy Farm with Sub-50ms Latency',
    outreachLimit: 'Unlimited Smart Outreach Engine',
    support: '24/7 Dedicated Solutions Architect',
    stripePriceId: 'price_gods_lead_monthly',
  },
];

export async function createCheckoutSession(params: {
  userId: string;
  email: string;
  tierId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const tier = PRICING_TIERS.find((t) => t.id === params.tierId) || PRICING_TIERS[1];
  
  // Real or mock Stripe Checkout URL builder
  const sessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
  return {
    sessionId,
    url: `${params.successUrl}?session_id=${sessionId}&tier=${tier.id}&trial=14_days`,
    tier,
  };
}

export function calculateTrialRemaining(trialEndsAt: string | Date): { daysRemaining: number; isExpired: boolean } {
  const end = new Date(trialEndsAt).getTime();
  const now = Date.now();
  const diff = end - now;
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  return {
    daysRemaining: days,
    isExpired: diff <= 0,
  };
}
