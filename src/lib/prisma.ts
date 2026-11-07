// Prisma Client Singleton per specification
// Supports Next.js App Router and Node.js runtime environments

// Type-safe shim for environments where Prisma CLI generate hasn't run yet
export interface PrismaClientType {
  user: any;
  crawlJob: any;
  businessLead: any;
  emailCampaign: any;
  proxyNode: any;
  apiKey: any;
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClientType | undefined;
}

let prismaClient: any;

if (typeof window === 'undefined') {
  try {
    const pkgName = '@prisma/client';
    // @ts-ignore
    const { PrismaClient } = await import(/* @vite-ignore */ pkgName).catch(() => ({ PrismaClient: null }));
    if (PrismaClient) {
      prismaClient = globalThis.prismaGlobal || new PrismaClient({ log: ['query', 'error', 'warn'] });
      if (process.env.NODE_ENV !== 'production') {
        globalThis.prismaGlobal = prismaClient;
      }
    }
  } catch {
    // Graceful fallback for browser/mock environments
  }
}

export const prisma = prismaClient || {
  user: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async (args: any) => args.data,
    update: async (args: any) => args.data,
  },
  crawlJob: {
    findMany: async () => [],
    create: async (args: any) => ({ id: 'cuid_' + Date.now(), ...args.data }),
    update: async (args: any) => args.data,
  },
  businessLead: {
    create: async (args: any) => ({ id: 'lead_' + Date.now(), ...args.data }),
    findMany: async () => [],
  },
  emailCampaign: {
    create: async (args: any) => ({ id: 'camp_' + Date.now(), ...args.data }),
    findMany: async () => [],
  },
  proxyNode: {
    findMany: async () => [],
    update: async (args: any) => args.data,
  },
  apiKey: {
    create: async (args: any) => ({ id: 'key_' + Date.now(), ...args.data }),
    findMany: async () => [],
  },
};

export default prisma;
