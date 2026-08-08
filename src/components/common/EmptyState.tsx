import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ElementType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  message = 'No relevant information is currently available for this search.',
  icon: Icon = Inbox,
}) => {
  return (
    <div className="glass-panel border border-slate-800 rounded-2xl p-8 text-center space-y-3 my-4">
      <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-semibold text-slate-200 text-sm">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">{message}</p>
    </div>
  );
};
