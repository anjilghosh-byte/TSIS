import React from 'react';
import { PhoneCall, AlertTriangle } from 'lucide-react';

interface SosButtonProps {
  onClick: () => void;
  size?: 'normal' | 'large';
}

export const SosButton: React.FC<SosButtonProps> = ({ onClick, size = 'large' }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <button
        type="button"
        onClick={onClick}
        className={`rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 text-white font-extrabold shadow-2xl shadow-red-600/40 animate-sos-pulse border-4 border-red-400/40 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
          size === 'large' ? 'w-44 h-44 text-xl' : 'w-32 h-32 text-lg'
        }`}
      >
        <AlertTriangle className="w-10 h-10 animate-bounce" />
        <span className="tracking-widest">🚨 SOS</span>
        <span className="text-[10px] font-semibold tracking-wider text-red-100 uppercase">EMERGENCY</span>
      </button>

      <div className="text-center">
        <div className="text-xs font-bold text-red-400 flex items-center justify-center gap-1">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>1-Tap Location & Contact Alert</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Acquires location and opens pre-filled SMS/Tel emergency dispatch.
        </p>
      </div>
    </div>
  );
};
