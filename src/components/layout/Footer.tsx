import React from 'react';
import { Shield, PhoneCall, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base">TSIS Intelligence</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering global travelers with real-time weather analytics, historical safety insights, verified incident news, and rapid SOS emergency dispatch tools.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-sky-400 transition-colors">
                  Home & Search
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('analysis')} className="hover:text-sky-400 transition-colors">
                  Destination Analysis
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('sos')} className="hover:text-red-400 transition-colors flex items-center gap-1">
                  <span>🚨 Emergency SOS</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('contacts')} className="hover:text-sky-400 transition-colors">
                  Emergency Contacts
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('about')} className="hover:text-sky-400 transition-colors">
                  Safety Philosophy & APIs
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">India Hotlines</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                <span>National Emergency</span>
                <span className="font-mono text-sky-400 font-bold">112</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                <span>Police Helpline</span>
                <span className="font-mono text-sky-400 font-bold">100</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                <span>Medical Ambulance</span>
                <span className="font-mono text-sky-400 font-bold">102 / 108</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                <span>Tourist Helpline</span>
                <span className="font-mono text-sky-400 font-bold">1363</span>
              </li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Disclaimer & Principle</h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Safety information is an advisory risk assessment and should not be considered an official safety clearance. Weather, crime, and news data are sourced from public APIs and historical statistics. Always adhere to local government and police advisories.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Tourist Safety Intelligence System (TSIS). Built for traveler safety.
          </div>
          <div className="flex items-center gap-1">
            <span>Designed with care for global explorers</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
