import React from 'react';
import { SearchBar } from './SearchBar';
import { DestinationInfo } from '../../types/location';
import { ShieldCheck, CloudSun, AlertTriangle, Radio } from 'lucide-react';

interface HeroSectionProps {
  onSelectDestination: (dest: DestinationInfo) => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectDestination,
  onUseCurrentLocation,
  isLoadingLocation,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-widest shadow-lg shadow-sky-500/10 animate-fade-in">
          <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>Know Before You Go &bull; Real-time Travel Risk Engine</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Explore with <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">Confidence</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Check live weather forecasts, historical crime statistics, verified local news advisories, and emergency assistance before you travel.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="pt-2">
          <SearchBar
            onSelectDestination={onSelectDestination}
            onUseCurrentLocation={onUseCurrentLocation}
            isLoadingLocation={isLoadingLocation}
          />
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80 text-left">
          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Weather Forecast</div>
              <div className="text-[11px] text-slate-400">Hourly & 7-Day</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Crime Insights</div>
              <div className="text-[11px] text-slate-400">NCRB Historical</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Verified News</div>
              <div className="text-[11px] text-slate-400">Local Incidents</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Instant SOS</div>
              <div className="text-[11px] text-slate-400">Emergency Link</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
