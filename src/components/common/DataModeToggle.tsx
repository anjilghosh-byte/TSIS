import React from 'react';
import { Database, Activity } from 'lucide-react';

interface DataModeToggleProps {
  isDemoMode: boolean;
  onToggle: (enabled: boolean) => void;
}

export const DataModeToggle: React.FC<DataModeToggleProps> = ({
  isDemoMode,
  onToggle,
}) => {
  return (
    <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-full p-1 text-xs">
      <button
        type="button"
        onClick={() => onToggle(false)}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
          !isDemoMode
            ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Activity className="w-3.5 h-3.5" />
        <span>Live API</span>
      </button>

      <button
        type="button"
        onClick={() => onToggle(true)}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
          isDemoMode
            ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Database className="w-3.5 h-3.5" />
        <span>Demo Data</span>
      </button>
    </div>
  );
};
