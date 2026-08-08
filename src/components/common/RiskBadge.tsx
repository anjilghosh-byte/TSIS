import React from 'react';
import { RiskLevel } from '../../types/risk';
import { ShieldCheck, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
}) => {
  const getBadgeStyle = () => {
    switch (level) {
      case 'LOW':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-500',
          icon: ShieldCheck,
          text: 'LOW RISK',
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-500',
          icon: AlertCircle,
          text: 'MODERATE RISK',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
          dot: 'bg-orange-500',
          icon: AlertTriangle,
          text: 'HIGH RISK',
        };
      case 'SEVERE':
        return {
          bg: 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse',
          dot: 'bg-red-500',
          icon: ShieldAlert,
          text: 'SEVERE WARNING',
        };
    }
  };

  const style = getBadgeStyle();
  const IconComponent = style.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-3 py-1 text-xs gap-1.5 font-semibold',
    lg: 'px-4 py-1.5 text-sm gap-2 font-bold tracking-wide',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${style.bg} ${sizeClasses}`}
    >
      <span className={`w-2 h-2 rounded-full ${style.dot} shrink-0`} />
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{style.text}</span>
    </span>
  );
};
