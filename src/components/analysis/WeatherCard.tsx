import React from 'react';
import { WeatherData } from '../../types/weather';
import { Thermometer, Wind, Droplets, Eye, Gauge, Sun, CloudRain } from 'lucide-react';
import { formatWindDirection } from '../../utils/formatters';

interface WeatherCardProps {
  weather: WeatherData;
  destinationName: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, destinationName }) => {
  const current = weather.current;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Current Weather</div>
          <h3 className="text-xl font-bold text-white mt-0.5">{destinationName}</h3>
        </div>
        {weather.isDemoData && (
          <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full font-mono font-bold">
            DEMO DATA
          </span>
        )}
      </div>

      {/* Main Temperature Hero Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-6">
          <div className="text-5xl font-black text-white font-mono tracking-tight">
            {current.temperature}&deg;<span className="text-2xl text-sky-400 font-sans">C</span>
          </div>
          <div>
            <div className="font-bold text-white text-base sm:text-lg">
              {current.weatherCondition}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Thermometer className="w-3.5 h-3.5 text-sky-400" />
              <span>Feels like {current.feelsLike}&deg;C</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-sky-300 bg-sky-500/10 px-4 py-2 rounded-xl border border-sky-500/20">
          <CloudRain className="w-4 h-4" />
          <span>{current.rainProbability}% Rain Chance ({current.precipitation} mm)</span>
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            <span>Humidity</span>
          </div>
          <div className="font-mono font-bold text-white text-base">{current.humidity}%</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            <span>Wind</span>
          </div>
          <div className="font-mono font-bold text-white text-base">
            {current.windSpeed} <span className="text-xs font-sans text-slate-400">km/h ({formatWindDirection(current.windDirection)})</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>UV Index</span>
          </div>
          <div className="font-mono font-bold text-white text-base">{current.uvIndex} <span className="text-xs text-slate-400 font-sans">/ 12</span></div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Visibility</span>
          </div>
          <div className="font-mono font-bold text-white text-base">{(current.visibility / 1000).toFixed(1)} <span className="text-xs font-sans text-slate-400">km</span></div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            <span>Pressure</span>
          </div>
          <div className="font-mono font-bold text-white text-base">{current.pressure} <span className="text-xs font-sans text-slate-400">hPa</span></div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            <span>Precipitation</span>
          </div>
          <div className="font-mono font-bold text-white text-base">{current.precipitation} <span className="text-xs font-sans text-slate-400">mm</span></div>
        </div>
      </div>
    </div>
  );
};
