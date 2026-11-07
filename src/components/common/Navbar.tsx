import React, { useState } from 'react';
import { 
  Zap, 
  Shield, 
  Flame, 
  Code, 
  Send, 
  Search, 
  CreditCard, 
  Menu, 
  X, 
  CheckCircle2, 
  ChevronDown,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { User, Role } from '../../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User;
  onSwitchUserRole: (role: Role, email: string) => void;
  onOpenCheckout: (tierId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onSwitchUserRole,
  onOpenCheckout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Platform', icon: Zap },
    { id: 'dashboard', label: 'Lead Scanner', icon: Search },
    { id: 'campaigns', label: 'Outreach', icon: Send },
    { id: 'admin', label: 'Admin Hub', icon: Shield, adminOnly: true },
    { id: 'dev', label: 'API & Dev', icon: Code },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
  ];

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]';
      case 'DEVELOPER':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]';
      case 'USER':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070a14]/85 backdrop-blur-xl transition-all">
      {/* Top Cyber Flash Line Runner */}
      <div className="h-[2px] w-full bg-gradient-to-r from-purple-500 via-orange-500 via-red-500 via-emerald-500 to-yellow-500 opacity-80" />

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('landing')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-transform group-hover:scale-105">
              <Flame className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-xl border border-white/40" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cyber text-lg font-black tracking-tight text-white group-hover:text-purple-300 transition-colors">
                  GODS LEAD ENGINE
                </span>
                <span className="hidden sm:inline-flex rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-300 tracking-wider">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                Cyber Intelligence & High-Velocity B2B Pipeline
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'text-white bg-white/10 shadow-[0_0_16px_rgba(168,85,247,0.25)] border border-purple-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: RBAC User Switcher & Primary Action */}
        <div className="flex items-center gap-3">
          {/* RBAC Role Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 hover:border-purple-500/40 hover:bg-slate-800 transition-all focus:outline-none"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold text-[10px]">
                {currentUser.name?.charAt(0) || 'G'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xs font-semibold text-white max-w-[110px] truncate">
                    {currentUser.email}
                  </span>
                  <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {userMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-xl border border-purple-500/30 bg-[#0d111e] p-3 shadow-2xl backdrop-blur-2xl z-50"
                onClick={() => setUserMenuOpen(false)}
              >
                <div className="mb-2.5 pb-2 border-b border-white/10">
                  <p className="text-[11px] font-medium text-slate-400">Current Session</p>
                  <p className="text-xs font-bold text-white truncate">{currentUser.email}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold border ${getRoleBadgeColor(currentUser.role)}`}>
                      {currentUser.role}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Status: {currentUser.status}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Simulate Role Access (RBAC)
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => onSwitchUserRole('ADMIN', 'gxqstudio@gmail.com')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      currentUser.role === 'ADMIN' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">Administrator (Master)</div>
                      <div className="text-[10px] text-slate-400">gxqstudio@gmail.com</div>
                    </div>
                    {currentUser.role === 'ADMIN' && <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />}
                  </button>

                  <button
                    onClick={() => onSwitchUserRole('DEVELOPER', 'dev@godslead.io')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      currentUser.role === 'DEVELOPER' ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">Developer Operator</div>
                      <div className="text-[10px] text-slate-400">dev@godslead.io</div>
                    </div>
                    {currentUser.role === 'DEVELOPER' && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />}
                  </button>

                  <button
                    onClick={() => onSwitchUserRole('USER', 'growth@agency.com')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      currentUser.role === 'USER' ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">Standard Agency User</div>
                      <div className="text-[10px] text-slate-400">growth@agency.com</div>
                    </div>
                    {currentUser.role === 'USER' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          {currentTab !== 'dashboard' ? (
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_28px_rgba(168,85,247,0.6)] transition-all whitespace-nowrap shrink-0"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" />
                <span>Launch Scanner</span>
              </span>
            </button>
          ) : (
            <button
              onClick={() => onOpenCheckout('pro')}
              className="relative group overflow-hidden rounded-xl border border-yellow-500/50 bg-yellow-500/10 px-3.5 py-2 text-xs font-bold text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:bg-yellow-500/20 transition-all whitespace-nowrap shrink-0"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                <span>14-Day Pro Trial</span>
              </span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg border border-white/10 bg-slate-900 p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#090d1a] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className="h-4 w-4 text-purple-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
