import React from 'react';
import { POPULAR_DESTINATIONS } from '../../services/locationService';
import { DestinationInfo } from '../../types/location';
import { MapPin, ArrowRight } from 'lucide-react';

interface FeaturedDestinationsProps {
  onSelectDestination: (dest: DestinationInfo) => void;
}

export const FeaturedDestinations: React.FC<FeaturedDestinationsProps> = ({
  onSelectDestination,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Popular Tourist Destinations
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Click any featured location for an instant safety assessment & weather breakdown.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {POPULAR_DESTINATIONS.map((dest) => (
          <div
            key={dest.id}
            onClick={() => onSelectDestination(dest)}
            className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between group border border-slate-800"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                  <MapPin className="w-3 h-3" />
                  {dest.state || dest.country}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-lg group-hover:text-sky-300 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-sky-300">
              <span>View Safety Assessment</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
