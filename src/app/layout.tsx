import type { Metadata } from 'next';
import React from 'react';
import '../index.css';

export const metadata: Metadata = {
  title: 'Gods Lead Engine | Enterprise Cyber Lead Generation & Business Intelligence SaaS',
  description: 'Enterprise Cyber-Futuristic Lead Generation & Business Intelligence SaaS with proxy rotation, deep Google Maps scraping, and automated outreach campaigns.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#05060b] text-slate-100 antialiased selection:bg-purple-600 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
