import React, { useState } from 'react';
import { Compass, Plus, Trash2, ArrowRight, MapPin, Calendar, Sparkles } from 'lucide-react';
import { DestinationInfo } from '../../types/location';
import { MultiCityStop, MultiCityPlan } from '../../types/planner';
import { POPULAR_DESTINATIONS } from '../../services/locationService';
import { generateMultiCityPlan } from '../../services/itineraryService';

interface MultiCityPlannerViewProps {
  onPlanGenerated: (multiPlan: MultiCityPlan) => void;
  onBackToSingle: () => void;
}

export const MultiCityPlannerView: React.FC<MultiCityPlannerViewProps> = ({
  onPlanGenerated,
  onBackToSingle,
}) => {
  const [stops, setStops] = useState<MultiCityStop[]>([
    { id: 'stop-1', destination: POPULAR_DESTINATIONS[6], days: 2 }, // Jaipur
    { id: 'stop-2', destination: POPULAR_DESTINATIONS[1], days: 3 }, // Darjeeling
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddStop = () => {
    const nextDest = POPULAR_DESTINATIONS[stops.length % POPULAR_DESTINATIONS.length];
    setStops((prev) => [
      ...prev,
      { id: `stop-${Date.now()}`, destination: nextDest, days: 2 },
    ]);
  };

  const handleRemoveStop = (id: string) => {
    if (stops.length <= 1) return;
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateDays = (id: string, days: number) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, days: Math.max(days, 1) } : s))
    );
  };

  const handleUpdateDest = (id: string, destName: string) => {
    const found = POPULAR_DESTINATIONS.find((d) => d.name === destName) || {
      id: `custom-${Date.now()}`,
      name: destName,
      country: 'India',
      coordinates: { lat: 26.9124, lng: 75.7873 },
    };
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, destination: found } : s))
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const plan = await generateMultiCityPlan(stops);
      onPlanGenerated(plan);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/30 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>Multi-City Route Planner</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Plan a Multi-Destination Journey</h2>
        </div>

        <button
          onClick={onBackToSingle}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
        >
          Single City Planner
        </button>
      </div>

      <div className="space-y-4">
        {stops.map((stop, idx) => (
          <div
            key={stop.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">City / Destination</label>
                <select
                  value={stop.destination.name}
                  onChange={(e) => handleUpdateDest(stop.id, e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs font-bold rounded-xl px-3 py-2 border border-slate-800 focus:outline-none"
                >
                  {POPULAR_DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.state || d.country})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Stay Duration</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={stop.days}
                    onChange={(e) => handleUpdateDays(stop.id, parseInt(e.target.value) || 1)}
                    className="w-16 bg-slate-950 text-white text-xs font-bold rounded-xl px-3 py-2 border border-slate-800 text-center"
                  />
                  <span className="text-xs text-slate-400 font-medium">Days</span>
                </div>
              </div>

              {stops.length > 1 && (
                <button
                  onClick={() => handleRemoveStop(stop.id)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={handleAddStop}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another City</span>
        </button>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl"
        >
          <Compass className="w-5 h-5" />
          <span>{isGenerating ? 'Building Multi-City Plan...' : 'Generate Combined Trip'}</span>
        </button>
      </div>
    </div>
  );
};
