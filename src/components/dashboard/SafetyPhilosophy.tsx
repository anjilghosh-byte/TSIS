import React from 'react';
import { ShieldCheck, Database, Radio, Sparkles, Scale } from 'lucide-react';

export const SafetyPhilosophy: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="glass-panel rounded-3xl p-8 md:p-12 border border-sky-500/20 bg-gradient-to-br from-slate-900/90 via-slate-950 to-sky-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldCheck className="w-64 h-64 text-sky-400" />
        </div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            Safety & Accuracy Principles
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Transparency & Responsible Risk Communication
          </h2>

          <blockquote className="p-4 rounded-xl bg-slate-900/90 border-l-4 border-sky-500 text-sky-200 text-sm italic">
            "Safety information is an advisory risk assessment and should not be considered an official safety clearance."
          </blockquote>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-xs sm:text-sm text-slate-300">
            <div className="space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                <span>Deterministic Scoring Engine</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Risk ratings (Low, Moderate, High, Severe) are calculated using transparent, open thresholds rather than hidden black-box predictions.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span>Historical Reported Crime Data</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Crime statistics reflect official NCRB reported historical records (2021-2024). They do not predict individual future crimes.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Official Warning Supremacy</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                When official government authorities or lifeguards issue red-flag closures, TSIS prioritizes those warnings over routine scores.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Privacy-First SOS System</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Emergency contacts are stored strictly on your device's browser storage. No personal contact lists are sold or stored on external servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
