export type Role = 'ADMIN' | 'USER' | 'DEVELOPER';

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';

export interface User {
  id: string;
  name: string | null;
  email: string;
  password?: string;
  role: Role;
  status: SubscriptionStatus;
  stripeId: string | null;
  trialEndsAt: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    crawls: number;
    campaigns: number;
    apiKeys: number;
  };
}

export interface BusinessLead {
  id: string;
  crawlId: string;
  name: string;
  category?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  rating?: number | null;
  reviewsCount?: number | null;
  mapsUrl?: string | null;
  verifiedEmail?: boolean;
  socials?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  operatingHours?: string | null;
  tags?: string[];
  createdAt: string;
}

export interface CrawlJob {
  id: string;
  userId: string;
  targetUrl: string;
  location?: string | null;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  totalFound: number;
  results?: BusinessLead[];
  activeProxy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailCampaign {
  id: string;
  userId: string;
  name: string;
  subject: string;
  body: string;
  status: 'DRAFT' | 'SENDING' | 'COMPLETED';
  sentCount: number;
  targetCount: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
}

export interface ProxyNode {
  id: string;
  host: string;
  port: number;
  protocol: 'http' | 'https' | 'socks5';
  username?: string | null;
  password?: string | null;
  isActive: boolean;
  latencyMs: number | null;
  location?: string;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface ScrapeLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'success' | 'proxy';
  message: string;
  node?: string;
}
