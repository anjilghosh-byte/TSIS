import React from 'react';
import { CompleteTripPlan } from '../../types/planner';
import { ShieldCheck, Clock, MapPin, DollarSign, Sparkles, CheckCircle } from 'lucide-react';

interface TripSummaryViewProps {
  plan: CompleteTripPlan;
}

export const TripSummaryView: React.FC<TripSummaryViewProps> = ({ plan }) => {
  const totalPlacesCount = plan.days.reduce((acc, day) => acc + day.items.length, 0);

  const totalSightseeingMinutes = plan.days.reduce(
    (acc, day) => acc + day.items.reduce((sum, item) => sum + item.durationMinutes, 0),
    0
  );
  const totalSightseeingHours = Math.round((totalSightseeingMinutes / 60) * 10) / 10;
  const estimatedTravelHours = Math.round((totalPlacesCount * 0.4) * 10) / 10;

  const budget = plan.budgetEstimate;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
      <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
        <Sparkles className="w-4 h-4" />
        <span>Comprehensive Trip Summary</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Destination</div>
          <div className="text-base font-bold text-white truncate">{plan.destination.name}</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Duration & Pace</div>
          <div className="text-base font-bold text-sky-400">
            {plan.durationDays} Days &bull; {plan.preferences.pace}
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Attractions</div>
          <div className="text-base font-bold text-emerald-400">{totalPlacesCount} Places</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Est. Sightseeing Time</div>
          <div className="text-base font-bold text-amber-400">~{totalSightseeingHours} Hours</div>
        </div>
      </div>

      {/* Safety Overview */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Safety & Environmental Overview</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Weather Risk:</span>
            <span className="ml-2 font-bold text-emerald-400">🟢 {plan.safetyOverview.weatherRisk}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Historical Safety Indicator:</span>
            <span className="ml-2 font-bold text-emerald-400">🟢 {plan.safetyOverview.historicalRisk}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Recent Advisories:</span>
            <span className="ml-2 font-bold text-slate-200">{plan.safetyOverview.recentAlertsCount} Alerts</span>
          </div>
        </div>
      </div>

      {/* Budget Estimate */}
      {budget && (
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-sky-400" />
              <span>Budget Estimate ({plan.preferences.travelStyle || 'Standard'} Style)</span>
            </h4>
            <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              Approximate Estimate
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">Accommodation</div>
              <div className="font-bold text-white">₹{budget.accommodation.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">Local Transport</div>
              <div className="font-bold text-white">₹{budget.localTransport.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">Food & Dining</div>
              <div className="font-bold text-white">₹{budget.food.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">Entry Fees</div>
              <div className="font-bold text-white">₹{budget.entryFees.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/20 border border-sky-500/40 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-sky-300 font-bold uppercase">Estimated Total</div>
              <div className="font-extrabold text-sky-200 text-sm">₹{budget.total.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
