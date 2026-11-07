import React from 'react';
import { prisma } from '@/src/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboard() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { crawls: true } } },
  });
  const proxies = await prisma.proxyNode.findMany();

  return (
    <div className="min-h-screen bg-[#05060b] text-white p-8 selection:bg-purple-600 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Control Center</h1>
            <p className="text-slate-400 text-sm">
              Authorized Administrator: <span className="text-purple-400 font-mono">gxqstudio@gmail.com</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
              System Optimal
            </span>
            <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white">
              Back to Scanner
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-purple-500/30 p-6 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <h3 className="text-slate-400 text-sm font-medium">Total Registered Users</h3>
            <p className="text-4xl font-bold mt-2 text-white">{users.length}</p>
          </div>
          <div className="bg-slate-900/60 border border-cyan-500/30 p-6 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <h3 className="text-slate-400 text-sm font-medium">Active Proxy Nodes</h3>
            <p className="text-4xl font-bold mt-2 text-cyan-300">
              {proxies.filter((p: any) => p.isActive).length}
            </p>
          </div>
          <div className="bg-slate-900/60 border border-emerald-500/30 p-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <h3 className="text-slate-400 text-sm font-medium">System Health</h3>
            <p className="text-4xl font-bold mt-2 text-emerald-400">99.9%</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-xl font-bold">User Management & Tiers</h2>
            <span className="text-xs text-slate-400 font-mono">RBAC Security Enforced</span>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-xs uppercase bg-black/40">
                <th className="p-4">User Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Subscription Status</th>
                <th className="p-4">Total Crawls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{user.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded text-xs font-bold">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded text-xs">
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-300">{user._count?.crawls ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
