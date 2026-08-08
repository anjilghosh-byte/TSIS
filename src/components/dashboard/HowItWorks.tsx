import React from 'react';
import { Search, Activity, FileText, PhoneCall } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Select Destination',
      icon: Search,
      desc: 'Search any worldwide location or use browser GPS location to analyze travel conditions.',
    },
    {
      num: '02',
      title: 'Choose Activity',
      icon: Activity,
      desc: 'Specify if you are planning Beach visits, Trekking, Camping, Sightseeing, or Water Sports.',
    },
    {
      num: '03',
      title: 'Review Risk & Bulletins',
      icon: FileText,
      desc: 'Inspect weather forecasts, NCRB crime trends, recent local incidents, and practical tips.',
    },
    {
      num: '04',
      title: 'Travel with SOS Ready',
      icon: PhoneCall,
      desc: 'Access 1-tap SOS location sharing and pre-configured family contacts if emergencies occur.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How TSIS Works</h2>
        <p className="text-slate-400 text-sm mt-2">
          Comprehensive 4-step intelligence workflow for smarter, safer travel choices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 relative group hover:border-sky-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-700 group-hover:text-sky-500/40 transition-colors">
                  {s.num}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base mb-1">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
