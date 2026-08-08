import React from 'react';

interface SkeletonCardProps {
  height?: string;
  count?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  height = 'h-48',
  count = 1,
}) => {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-full ${height} rounded-2xl glass-panel p-6 animate-pulse flex flex-col justify-between border border-slate-800`}
        >
          <div className="space-y-3">
            <div className="h-5 bg-slate-800 rounded-md w-1/3" />
            <div className="h-4 bg-slate-800/60 rounded-md w-2/3" />
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/40">
            <div className="h-10 bg-slate-800/40 rounded-lg" />
            <div className="h-10 bg-slate-800/40 rounded-lg" />
            <div className="h-10 bg-slate-800/40 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
