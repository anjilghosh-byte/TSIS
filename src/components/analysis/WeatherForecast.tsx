import React, { useState } from 'react';
import { WeatherData } from '../../types/weather';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, CloudRain, Wind } from 'lucide-react';

interface WeatherForecastProps {
  weather: WeatherData;
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ weather }) => {
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily'>('hourly');

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Weather Forecast</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time atmospheric predictions for the next 24 hours & 7 days.
          </p>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setActiveTab('hourly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'hourly'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Next 24 Hours</span>
          </button>

          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'daily'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Outlook</span>
          </button>
        </div>
      </div>

      {/* Hourly View */}
      {activeTab === 'hourly' && (
        <div className="space-y-6">
          {/* Temperature Recharts Area Chart */}
          <div className="h-44 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weather.hourly.slice(0, 12)}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="°C" domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Horizontal Scroll Cards */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {weather.hourly.slice(0, 16).map((item, idx) => (
              <div
                key={idx}
                className="min-w-[100px] bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 text-center space-y-2 shrink-0 hover:border-sky-500/40 transition-colors"
              >
                <div className="text-xs font-mono text-slate-400">{item.time}</div>
                <div className="font-mono font-bold text-white text-base">{item.temperature}&deg;C</div>
                <div className="text-[10px] text-slate-300 truncate font-medium">{item.weatherCondition}</div>
                <div className="flex items-center justify-center gap-1 text-[10px] text-sky-400 font-semibold bg-sky-500/10 py-0.5 rounded-full">
                  <CloudRain className="w-2.5 h-2.5" />
                  <span>{item.rainProbability}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily View */}
      {activeTab === 'daily' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {weather.daily.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between hover:border-sky-500/30 transition-colors"
            >
              <div>
                <div className="font-bold text-white text-xs">{item.date}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium leading-snug">{item.weatherCondition}</div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-sky-400 font-bold">{item.maxTemp}&deg;C</span>
                  <span className="text-slate-500">{item.minTemp}&deg;C</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 text-sky-400 font-semibold">
                    <CloudRain className="w-3 h-3" /> {item.rainProbability}%
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Wind className="w-3 h-3" /> {item.maxWindSpeed}km/h
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
