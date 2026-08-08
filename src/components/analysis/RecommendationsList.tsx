import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: string[];
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
}) => {
  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Safety Recommendations</h3>
          <p className="text-xs text-slate-400">Practical guidance tailored to your planned activity and weather.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-slate-200"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{rec}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
