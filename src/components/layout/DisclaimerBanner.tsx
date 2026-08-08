import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-sky-950/80 border-b border-sky-800/40 text-sky-200 text-xs sm:text-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong>Safety Advisory Notice:</strong> Safety information is an informational risk assessment and should not be considered an official safety clearance. Always follow local authority instructions.
          </span>
        </div>
        <a
          href="/about"
          className="hidden md:flex items-center gap-1 text-sky-400 hover:text-sky-300 underline font-medium shrink-0"
        >
          <Info className="w-3.5 h-3.5" />
          Learn More
        </a>
      </div>
    </div>
  );
};
