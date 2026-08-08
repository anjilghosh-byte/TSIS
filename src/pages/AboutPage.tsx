import React from 'react';
import { Shield, CloudSun, Radio, Database, Scale, PhoneCall, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-8 border border-sky-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950/30 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>System Architecture & Principles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">How TSIS Works</h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          The Tourist Safety Intelligence System (TSIS) integrates multiple data streams to give travelers comprehensive, transparent risk assessments before and during travel.
        </p>
      </div>

      {/* Grid of Technical Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Weather API */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
            <CloudSun className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">1. Weather API & Forecast Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Integrated with Open-Meteo's worldwide meteorological API. Provides current temperatures, feels-like metrics, precipitation, wind speed, UV index max, and 24-hour / 7-day hourly & daily outlooks mapped via standard WMO interpretation codes.
          </p>
        </div>

        {/* Module 2: News API */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">2. Local Incident News Integration</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Queries News API endpoints with destination-specific keywords (weather, closures, safety advisories, accidents). Features a cached local bulletin engine if external APIs are temporarily unavailable.
          </p>
        </div>

        {/* Module 3: Crime Statistics */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">3. Historical Crime Statistics (NCRB)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Incorporates National Crime Records Bureau (NCRB) & state crime statistics (2021-2024 trends). Explicitly labeled as historical statistics rather than real-time crime prediction.
          </p>
        </div>

        {/* Module 4: Risk Scoring Engine */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">4. Explainable Risk Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluates conditions deterministically into LOW, MODERATE, HIGH, or SEVERE risk. Tailored specifically for activities (Beach, Trekking, Camping, Sightseeing). Generates natural language explanations ("Why?").
          </p>
        </div>
      </div>

      {/* SOS System & Browser Limitations */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">5. Emergency SOS & Browser Compliance</h3>
            <p className="text-xs text-slate-400">Strict adherence to web security standards.</p>
          </div>
        </div>

        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            Normal web browsers cannot silently send SMS or make calls in the background without user interaction.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Acquires exact GPS coordinates and builds a live Google Maps shareable link.</span>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Uses standard <code className="text-sky-400 font-mono">sms:</code> and <code className="text-sky-400 font-mono">tel:</code> deep links for user-confirmed dispatch.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
