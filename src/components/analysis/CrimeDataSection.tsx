import React from 'react';
import { CrimeData } from '../../types/crime';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Shield, Info, TrendingDown } from 'lucide-react';
import { formatNumberWithCommas } from '../../utils/formatters';

interface CrimeDataSectionProps {
  crimeData: CrimeData;
}

export const CrimeDataSection: React.FC<CrimeDataSectionProps> = ({ crimeData }) => {
  const latestYear = crimeData.yearlyTrends[crimeData.yearlyTrends.length - 1];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Historical Reported Crime Data
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
              NCRB Records (2021-2024)
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mt-0.5">{crimeData.region}</h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <TrendingDown className="w-4 h-4" />
          <span>Historical Crime Downward Trend</span>
        </div>
      </div>

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
        <div>
          <div className="text-[11px] text-slate-400 font-medium">Total Cases (2024)</div>
          <div className="text-xl font-black text-white font-mono mt-0.5">
            {formatNumberWithCommas(latestYear.totalReportedCases)}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-slate-400 font-medium">Theft & Robbery</div>
          <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
            {formatNumberWithCommas(latestYear.theftAndRobbery)}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-slate-400 font-medium">Tourist Targeted</div>
          <div className="text-xl font-black text-sky-400 font-mono mt-0.5">
            {formatNumberWithCommas(latestYear.touristTargetedIncidents)}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-slate-400 font-medium">Scams & Fraud</div>
          <div className="text-xl font-black text-indigo-400 font-mono mt-0.5">
            {formatNumberWithCommas(latestYear.fraudAndScams)}
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart for 2021 - 2024 Trends */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-300">Annual Trend Breakdown (2021 &ndash; 2024)</div>
        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={crimeData.yearlyTrends}>
              <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="theftAndRobbery" name="Theft & Robbery" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="touristTargetedIncidents" name="Tourist Targeted" fill="#0284c7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fraudAndScams" name="Scams & Fraud" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explicit Disclaimer Notice */}
      <div className="flex items-start gap-2 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="leading-relaxed">
            <strong>Historical Reported Crime Data Notice:</strong> These figures represent historical reported annual records published by official crime reporting agencies (NCRB). They serve as general regional safety context and do NOT predict real-time individual incidents.
          </p>
          <p className="text-[11px] text-slate-400">Data Source: {crimeData.source}</p>
        </div>
      </div>
    </div>
  );
};
