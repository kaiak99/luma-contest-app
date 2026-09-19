'use client';

import React from 'react';

interface RivieraLogoProps {
  className?: string;
  size?: number;
}

export const RivieraLogo: React.FC<RivieraLogoProps> = ({ className = '', size = 36 }) => {
  return (
    <div 
      className={`rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Modern geometric architectural wave / R monogram in pure SVG */}
      <svg
        width={Math.round(size * 0.6)}
        height={Math.round(size * 0.6)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 16C7 16 8 13 11 13C14 13 15 16 18 16C19.5 16 20.5 15 21 14"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 10C6 10 7 7 10 7C13 7 14 10 17 10C18.5 10 19.5 9 20 8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.6"
        />
      </svg>
    </div>
  );
};
