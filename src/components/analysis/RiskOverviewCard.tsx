import React from 'react';
import { RiskAssessment } from '../../types/risk';
import { RiskBadge } from '../common/RiskBadge';
import { Shield, AlertOctagon, HelpCircle, CheckCircle } from 'lucide-react';

interface RiskOverviewCardProps {
  assessment: RiskAssessment;
  destinationName: string;
}

export const RiskOverviewCard: React.FC<RiskOverviewCardProps> = ({
  assessment,
  destinationName,
}) => {
  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-sky-500/20 shadow-2xl relative overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/90 space-y-6">
      {/* Official Warning Banner (Highest Priority) */}
      {assessment.officialWarning && (
        <div className="bg-red-500/15 border-2 border-red-500/50 rounded-2xl p-4 flex items-start gap-3 animate-pulse">
          <AlertOctagon className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-extrabold text-red-200 text-sm sm:text-base">
              OFFICIAL WARNING: {assessment.officialWarning.title}
            </div>
            <p className="text-xs text-red-300 leading-relaxed">
              {assessment.officialWarning.description}
            </p>
            <div className="text-[11px] text-red-400 font-semibold pt-1">
              Source: {assessment.officialWarning.issuedBy}
            </div>
          </div>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-sky-400">
            Safety Assessment & Risk Analysis
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {destinationName}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-medium">Safety Score</div>
            <div className="text-2xl font-black text-sky-400 font-mono">
              {assessment.numericalScore}<span className="text-xs text-slate-500 font-sans">/100</span>
            </div>
          </div>
          <RiskBadge level={assessment.overallRisk} size="lg" />
        </div>
      </div>

      {/* Why Explanation Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Why this risk score?</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          {assessment.explanation}
        </p>
      </div>

      {/* Fact Assurance Note */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Evaluated against active weather APIs, historical crime dataset records, and activity factors.
        </span>
      </div>
    </div>
  );
};
