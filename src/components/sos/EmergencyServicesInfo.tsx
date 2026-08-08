import React from 'react';
import { OFFICIAL_EMERGENCY_SERVICES } from '../../config/emergencyServices';
import { PhoneCall, ShieldAlert, LifeBuoy } from 'lucide-react';
import { generateTelDeepLink } from '../../services/emergencyService';

export const EmergencyServicesInfo: React.FC = () => {
  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
          <LifeBuoy className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Official Emergency Hotlines (India)</h3>
          <p className="text-xs text-slate-400">Verified official response dispatches & tourist assistance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OFFICIAL_EMERGENCY_SERVICES.map((service) => (
          <div
            key={service.number}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span>{service.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{service.description}</p>
            </div>

            <a
              href={generateTelDeepLink(service.number)}
              className="px-4 py-2.5 bg-red-600/90 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-red-600/20 shrink-0 transition-transform hover:scale-105"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call {service.number}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
