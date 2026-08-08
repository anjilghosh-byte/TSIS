import React, { useState } from 'react';
import { Shield, AlertTriangle, Users, Info, Compass, Menu, X, PhoneCall } from 'lucide-react';
import { DataModeToggle } from '../common/DataModeToggle';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isDemoMode: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDemoMode,
  onToggleDemoMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'analysis', label: 'Safety Analysis', icon: Shield },
    { id: 'sos', label: 'Emergency SOS', icon: AlertTriangle, badge: '🚨' },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'about', label: 'How It Works', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              onSelectTab('home');
              setMobileMenuOpen(false);
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">
                TSIS
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1 hidden sm:block">
                Tourist Safety Intelligence
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              if (item.id === 'sos') {
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className="ml-2 px-3.5 py-1.5 rounded-full bg-red-600/90 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 animate-sos-pulse border border-red-400/30 transition-all hover:scale-105"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>🚨 SOS EMERGENCY</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls & Demo Toggle */}
          <div className="flex items-center gap-3">
            <DataModeToggle isDemoMode={isDemoMode} onToggle={onToggleDemoMode} />

            {/* Mobile menu trigger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium ${
                  item.id === 'sos'
                    ? 'bg-red-600 text-white font-bold my-2 shadow-lg shadow-red-600/30'
                    : isActive
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span className="text-xs">{item.badge}</span>}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
