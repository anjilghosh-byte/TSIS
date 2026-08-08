import React from 'react';
import { RiskAssessment } from '../../types/risk';
import { RiskBadge } from '../common/RiskBadge';
import { CloudSun, Shield, Radio, Activity } from 'lucide-react';

interface RiskBreakdownProps {
  assessment: RiskAssessment;
}

export const RiskBreakdown: React.FC<RiskBreakdownProps> = ({ assessment }) => {
  const factors = [
    {
      label: 'Weather Risk',
      level: assessment.factors.weatherRisk,
      icon: CloudSun,
      desc: 'Based on current precipitation, wind, UV, and atmospheric conditions.',
    },
    {
      label: 'Historical Crime Indicator',
      level: assessment.factors.crimeRisk,
      icon: Shield,
      desc: 'Based on reported regional NCRB statistics (2021-2024 trends).',
    },
    {
      label: 'Recent News & Advisories',
      level: assessment.factors.newsRisk,
      icon: Radio,
      desc: 'Based on available verified local news reports and weather bulletins.',
    },
    {
      label: 'Activity Suitability',
      level: assessment.factors.activityRisk,
      icon: Activity,
      desc: `Evaluated specifically for planned ${assessment.evaluatedActivity.replace('_', ' ')}.`,
    },
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
      <h3 className="font-bold text-white text-base">Risk Factor Breakdown</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {factors.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.label}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <RiskBadge level={f.level} size="sm" />
              </div>
              <div>
                <div className="font-bold text-slate-200 text-xs sm:text-sm">{f.label}</div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
