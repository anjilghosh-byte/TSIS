import React from 'react';
import { SearchBar } from './SearchBar';
import { DestinationInfo } from '../../types/location';
import { ShieldCheck, CloudSun, Compass, Radio, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onSelectDestination: (dest: DestinationInfo) => void;
  onPlanTripForDestination?: (dest: DestinationInfo) => void;
  onOpenTripPlanner?: () => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectDestination,
  onPlanTripForDestination,
  onOpenTripPlanner,
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
          <span>Know Before You Go &bull; Smart Travel Planner & Risk Engine</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Plan Smart. <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">Travel Safely.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover attractions, generate day-wise weather-aware itineraries, and check live safety advisories before you travel.
          </p>
        </div>

        {/* Dual Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {onOpenTripPlanner && (
            <button
              onClick={onOpenTripPlanner}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-sky-500/25 transition-all hover:scale-105"
            >
              <Compass className="w-5 h-5 animate-spin-slow" />
              <span>🧭 Plan My Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              const el = document.getElementById('search-anchor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-extrabold text-sm sm:text-base border border-slate-700 flex items-center gap-2.5 transition-all"
          >
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <span>🔍 Check Destination Safety</span>
          </button>
        </div>

        {/* Search Bar Container */}
        <div id="search-anchor" className="pt-4">
          <SearchBar
            onSelectDestination={onSelectDestination}
            onPlanTripForDestination={onPlanTripForDestination}
            onUseCurrentLocation={onUseCurrentLocation}
            isLoadingLocation={isLoadingLocation}
          />
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80 text-left">
          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Smart Travel Guide</div>
              <div className="text-[11px] text-slate-400">Day-wise Itineraries</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Weather-Aware</div>
              <div className="text-[11px] text-slate-400">Rain & Heat Shift</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Safety Engine</div>
              <div className="text-[11px] text-slate-400">NCRB & Verified News</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Instant SOS</div>
              <div className="text-[11px] text-slate-400">Emergency Alerting</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
