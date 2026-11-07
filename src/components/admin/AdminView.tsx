import React, { useState } from 'react';
import { 
  Shield, 
  Server, 
  Users, 
  Activity, 
  CheckCircle2, 
  RotateCw, 
  Plus, 
  Radio, 
  ExternalLink,
  Lock,
  Zap,
  Globe,
  Sliders,
  Sparkles
} from 'lucide-react';
import { User, ProxyNode, Role, SubscriptionStatus } from '../../types';
import { FlashGlowCard } from '../common/FlashGlowCard';

interface AdminViewProps {
  users: User[];
  proxies: ProxyNode[];
  onUpdateUserRole: (userId: string, newRole: Role) => void;
  onUpdateUserStatus: (userId: string, newStatus: SubscriptionStatus) => void;
  onToggleProxyActive: (proxyId: string) => void;
  onTestProxyLatencies: () => void;
  onAddProxyNode: (node: { host: string; port: number; protocol: 'http' | 'https' | 'socks5'; location: string }) => void;
  isTestingProxies: boolean;
}

export const AdminView: React.FC<AdminViewProps> = ({
  users,
  proxies,
  onUpdateUserRole,
  onUpdateUserStatus,
  onToggleProxyActive,
  onTestProxyLatencies,
  onAddProxyNode,
  isTestingProxies,
}) => {
  const [showAddProxyModal, setShowAddProxyModal] = useState(false);
  const [newHost, setNewHost] = useState('');
  const [newPort, setNewPort] = useState('8080');
  const [newProtocol, setNewProtocol] = useState<'http' | 'https' | 'socks5'>('https');
  const [newLocation, setNewLocation] = useState('US-Central (Chicago)');

  const handleAddProxy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHost || !newPort) return;
    onAddProxyNode({
      host: newHost,
      port: parseInt(newPort, 10),
      protocol: newProtocol,
      location: newLocation,
    });
    setNewHost('');
    setShowAddProxyModal(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Admin Header Card */}
      <FlashGlowCard glowColor="purple" withFlashLine className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/20 px-3 py-0.5 text-xs font-bold text-purple-300">
                <Shield className="h-3.5 w-3.5" />
                MASTER SYSTEM ARCHITECTURE
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                System Optimal (99.9%)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Admin Control Center & Telemetry
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Authorized Administrator: <strong className="text-purple-300 font-mono">gxqstudio@gmail.com</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTestProxyLatencies}
              disabled={isTestingProxies}
              className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all disabled:opacity-50"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isTestingProxies ? 'animate-spin' : ''}`} />
              <span>Ping & Test Node Pool</span>
            </button>
            <button
              onClick={() => setShowAddProxyModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Proxy Node</span>
            </button>
          </div>
        </div>
      </FlashGlowCard>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FlashGlowCard glowColor="purple" className="p-5">
          <span className="text-xs font-medium text-slate-400">Total Registered Users</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white tabular-nums">{users.length}</span>
            <span className="text-xs font-semibold text-purple-400">All Tiers</span>
          </div>
        </FlashGlowCard>

        <FlashGlowCard glowColor="green" className="p-5">
          <span className="text-xs font-medium text-slate-400">Active Proxy Nodes</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-400 tabular-nums">
              {proxies.filter((p) => p.isActive).length} / {proxies.length}
            </span>
            <span className="text-xs text-emerald-400 font-mono">Rotating</span>
          </div>
        </FlashGlowCard>

        <FlashGlowCard glowColor="orange" className="p-5">
          <span className="text-xs font-medium text-slate-400">Average Node Latency</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white tabular-nums">
              {Math.round(
                proxies.filter((p) => p.latencyMs).reduce((a, b) => a + (b.latencyMs || 0), 0) /
                  (proxies.filter((p) => p.latencyMs).length || 1)
              )} ms
            </span>
            <span className="text-xs text-cyan-400">Sub-100ms Target</span>
          </div>
        </FlashGlowCard>

        <FlashGlowCard glowColor="yellow" className="p-5">
          <span className="text-xs font-medium text-slate-400">System Telemetry</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-yellow-400 tabular-nums">100%</span>
            <span className="text-xs text-slate-400 font-mono">0 Egress Blocks</span>
          </div>
        </FlashGlowCard>
      </div>

      {/* Proxy Nodes Pool Management */}
      <FlashGlowCard glowColor="orange" withFlashLine className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Proxy & VPN Residential Rotation Pool</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Anti-Fingerprint Cluster</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {proxies.map((node) => {
            return (
              <div
                key={node.id}
                className={`rounded-xl border p-4 transition-all ${
                  node.isActive
                    ? 'border-white/10 bg-black/40 hover:border-cyan-500/40'
                    : 'border-red-500/20 bg-red-950/10 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        node.isActive ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-red-400'
                      }`}
                    />
                    <span className="font-mono text-xs font-bold text-white">
                      {node.host}:{node.port}
                    </span>
                  </div>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300 uppercase">
                    {node.protocol}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-2">{node.location || 'Global Datacenter'}</p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <span className="text-slate-400">
                    Latency:{' '}
                    <strong className="text-emerald-400 font-mono">{node.latencyMs ? `${node.latencyMs}ms` : 'Checking...'}</strong>
                  </span>
                  <button
                    onClick={() => onToggleProxyActive(node.id)}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-colors ${
                      node.isActive
                        ? 'bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30'
                    }`}
                  >
                    {node.isActive ? 'Deactivate' : 'Enable Node'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </FlashGlowCard>

      {/* Users & Tiers Table */}
      <FlashGlowCard glowColor="purple" withFlashLine className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-400" />
            <h2 className="text-lg font-bold text-white">User Accounts, Tiers & Role-Based Access</h2>
          </div>
          <span className="text-xs text-slate-400">Instant Role Modification</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase tracking-wider bg-black/40">
                <th className="p-3">User & Contact</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Subscription Status</th>
                <th className="p-3">Total Crawls</th>
                <th className="p-3 text-right">Overrides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {users.map((usr) => (
                <tr key={usr.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-white">{usr.name || 'Anonymous User'}</div>
                    <div className="text-[11px] font-mono text-slate-400">{usr.email}</div>
                  </td>
                  <td className="p-3">
                    <select
                      value={usr.role}
                      onChange={(e) => onUpdateUserRole(usr.id, e.target.value as Role)}
                      className="glass-input px-2.5 py-1 text-xs text-white"
                    >
                      <option value="ADMIN" className="bg-slate-900">ADMIN</option>
                      <option value="DEVELOPER" className="bg-slate-900">DEVELOPER</option>
                      <option value="USER" className="bg-slate-900">USER</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      value={usr.status}
                      onChange={(e) => onUpdateUserStatus(usr.id, e.target.value as SubscriptionStatus)}
                      className="glass-input px-2.5 py-1 text-xs text-white"
                    >
                      <option value="ACTIVE" className="bg-slate-900">ACTIVE</option>
                      <option value="TRIAL" className="bg-slate-900">TRIAL</option>
                      <option value="PAST_DUE" className="bg-slate-900">PAST_DUE</option>
                      <option value="CANCELED" className="bg-slate-900">CANCELED</option>
                    </select>
                  </td>
                  <td className="p-3 font-mono tabular-nums text-slate-200">
                    {usr._count?.crawls ?? 0} jobs
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Stripe: {usr.stripeId ? 'Attached' : 'Direct Access'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FlashGlowCard>

      {/* Add Proxy Modal */}
      {showAddProxyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md">
            <FlashGlowCard glowColor="purple" withFlashLine className="p-6">
              <h3 className="text-lg font-black text-white mb-4">Add Rotating Proxy Node</h3>
              <form onSubmit={handleAddProxy} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Host IP / Domain</label>
                  <input
                    type="text"
                    value={newHost}
                    onChange={(e) => setNewHost(e.target.value)}
                    placeholder="e.g. 198.51.100.99"
                    className="w-full glass-input px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Port</label>
                    <input
                      type="number"
                      value={newPort}
                      onChange={(e) => setNewPort(e.target.value)}
                      placeholder="8080"
                      className="w-full glass-input px-3 py-2 text-white font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Protocol</label>
                    <select
                      value={newProtocol}
                      onChange={(e) => setNewProtocol(e.target.value as any)}
                      className="w-full glass-input px-3 py-2 text-white"
                    >
                      <option value="https" className="bg-slate-900">HTTPS</option>
                      <option value="socks5" className="bg-slate-900">SOCKS5</option>
                      <option value="http" className="bg-slate-900">HTTP</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Node Geo Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. US-Central (Chicago)"
                    className="w-full glass-input px-3 py-2 text-white"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddProxyModal(false)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-slate-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  >
                    Deploy Node
                  </button>
                </div>
              </form>
            </FlashGlowCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
