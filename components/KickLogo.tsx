import React from 'react';

interface KickLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function KickLogo({ className = '', size = 32, showText = true }: KickLogoProps) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Official Kick Brand Green Logo Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 300 300"
        fill="#53FC18"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-label="SaveThisKick Logo"
      >
        <path d="M 22 30 L 82 30 A 14 14 0 0 1 96 44 L 96 61 A 14 14 0 0 1 82 75 L 51 75 L 51 155 A 14 14 0 0 1 37 169 L 20 169 A 14 14 0 0 1 6 155 L 6 46 A 16 16 0 0 1 22 30 Z" />
        <path d="M 139 30 L 161 30 A 16 16 0 0 1 177 46 L 177 164 L 218 164 A 12 12 0 0 1 230 176 L 224 186 L 158 264 A 12 12 0 0 1 142 264 L 76 186 L 70 176 A 12 12 0 0 1 82 164 L 123 164 L 123 46 A 16 16 0 0 1 139 30 Z" />
        <path d="M 278 30 L 218 30 A 14 14 0 0 0 204 44 L 204 61 A 14 14 0 0 0 218 75 L 249 75 L 249 155 A 14 14 0 0 0 263 169 L 280 169 A 14 14 0 0 0 294 155 L 294 46 A 16 16 0 0 0 278 30 Z" />
      </svg>

      {showText && (
        <div className="flex items-center tracking-tight text-lg sm:text-xl font-semibold">
          <span className="text-slate-800 dark:text-white">SaveThis</span>
          <span className="text-[#53FC18] font-bold ml-1">Kick</span>
        </div>
      )}
    </div>
  );
}
