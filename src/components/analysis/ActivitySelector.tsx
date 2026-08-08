import React from 'react';
import { ActivityType } from '../../types/location';
import { Compass, Palmtree, Mountain, Tent, Eye, Waves, Car, ShieldAlert } from 'lucide-react';

interface ActivitySelectorProps {
  selectedActivity: ActivityType;
  onSelectActivity: (act: ActivityType) => void;
}

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  selectedActivity,
  onSelectActivity,
}) => {
  const activities: { id: ActivityType; label: string; icon: React.ElementType; focusText: string }[] = [
    { id: 'general_tourism', label: 'General Tourism', icon: Compass, focusText: 'Temperature, rain, general navigation' },
    { id: 'beach', label: 'Beach Visit', icon: Palmtree, focusText: 'Storm surge, strong wind, UV index, swimming tides' },
    { id: 'trekking', label: 'Trekking', icon: Mountain, focusText: 'Rainfall, landslides, thunderstorm, trail visibility' },
    { id: 'hiking', label: 'Hiking', icon: Mountain, focusText: 'Precipitation, path slip risk, wind gusts' },
    { id: 'camping', label: 'Camping', icon: Tent, focusText: 'Night temperatures, rain accumulation, wind safety' },
    { id: 'sightseeing', label: 'Sightseeing', icon: Eye, focusText: 'Rain probability, monument opening, heat levels' },
    { id: 'water_sports', label: 'Water Activities', icon: Waves, focusText: 'Water velocity, wave swell, thunderstorm risks' },
    { id: 'mountain_travel', label: 'Mountain Travel', icon: Car, focusText: 'Road visibility, heavy fog, rockfall warnings' },
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-bold text-white">What are you planning to do?</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            TSIS evaluates weather factors differently based on your specific activity.
          </p>
        </div>
      </div>

      {/* Grid of Activity Pill Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {activities.map((act) => {
          const Icon = act.icon;
          const isSelected = selectedActivity === act.id;

          return (
            <button
              key={act.id}
              type="button"
              onClick={() => onSelectActivity(act.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-sky-500/20 border-sky-500/50 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-900/70 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                )}
              </div>

              <div>
                <div className={`font-bold text-sm ${isSelected ? 'text-sky-300' : 'text-white'}`}>
                  {act.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {act.focusText}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Official Closure Disclaimer Note */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
        <span>
          <strong>Notice:</strong> Specific trail or beach operational status requires verification with local forest/beach authority booths before arrival.
        </span>
      </div>
    </div>
  );
};
