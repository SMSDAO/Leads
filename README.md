# Gods Lead Engine: Enterprise Cyber-Futuristic Lead Generation & Business Intelligence SaaS

A production-grade, full-stack application built for high-velocity B2B lead scraping, rotating residential proxy clusters, deep email and contact enrichment, and automated multi-channel cold outreach.

---

## ⚡ Core Capabilities

1. **Google Maps & Local Directory Scraping Engine**:
   - Custom query parsing supporting keywords, Google Maps URLs, zip codes, cities, states, and countries.
   - Deep website and social registry parsing for verified decision-maker emails, phone numbers, addresses, ratings, and review counts.

2. **Rotating Residential Proxy & VPN Pool (`ProxyNode`)**:
   - Dynamic round-robin and latency-based node assignment.
   - Multi-protocol support (`https`, `socks5`, `http`).
   - Automated anti-fingerprint headers, TLS 1.3 masquerade, and zero-CAPTCHA failover.

3. **Automated Email Outreach Sequences (`EmailCampaign`)**:
   - Dynamic template compilation with variables: `{{business_name}}`, `{{category}}`, `{{city}}`.
   - Real-time batch dispatcher with live delivery tracking, open rates, and click-through analytics.

4. **Multi-Tier Role-Based Access Control (RBAC)**:
   - **ADMIN**: Automatically assigned to master administrator `gxqstudio@gmail.com` with system telemetry, user role overrides, proxy health monitoring, and billing overrides.
   - **DEVELOPER**: API secret key generation, cURL/SDK sandbox, and real-time webhook payload logs.
   - **USER**: Standard lead generation, active crawl jobs, and export tools.

5. **Subscription & 14-Day Free Trial Layer**:
   - Integrated billing with Stripe checkout and webhook listeners (`checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`).
   - Default 14-day full unthrottled access on all plan tiers.

6. **Cyber-Futuristic Glassmorphism UI**:
   - High-contrast dark theme with animated multi-color neon glow border effects (`purple`, `orange`, `red`, `green`, `yellow`).
   - `flash-glow-card` container styling with soft backdrop blurs and flash rounded corners.
   - Responsive web and mobile app experience.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Full-Stack & API**: Next.js App Router route handlers (`/api/crawl`, `/api/campaigns`, `/api/webhooks/stripe`, `/api/auth/[...nextauth]`)
- **Database & ORM**: PostgreSQL, Prisma ORM (`prisma/schema.prisma`)
- **Containerization**: Docker Compose (`docker-compose.yml`)

---

## 🚀 Quickstart & Deployment

### 1. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Launch PostgreSQL via Docker Compose
```bash
docker-compose up -d
```

### 3. Initialize Prisma ORM
```bash
npx prisma migrate dev --name init
```

### 4. Run Development Server
```bash
npm run dev
```
Access the application at `http://localhost:3000`.

---

## 🔐 Master Administrator Access
Sign in with `gxqstudio@gmail.com` to automatically unlock administrative privileges across the `/admin` control workspace and manage system health, user tiers, and proxy nodes.
