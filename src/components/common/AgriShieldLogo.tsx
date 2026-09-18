import React from 'react';
import { AgriShieldIcon } from './AgriShieldIcon';

export interface AgriShieldLogoProps {
  className?: string;
  iconClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textClassName?: string;
  lightText?: boolean;
  iconOnly?: boolean;
  withContainer?: boolean;
}

export const AgriShieldLogo: React.FC<AgriShieldLogoProps> = ({
  className = '',
  iconClassName = '',
  size = 'md',
  showText = true,
  textClassName = '',
  lightText = false,
  iconOnly = false,
  withContainer = false
}) => {
  const textSizeMap = {
    xs: 'text-sm font-black',
    sm: 'text-base sm:text-lg font-black',
    md: 'text-lg sm:text-xl font-black',
    lg: 'text-2xl sm:text-3xl font-black',
    xl: 'text-3xl sm:text-4xl font-black',
    '2xl': 'text-4xl sm:text-5xl font-black'
  };

  const aiBadgeMap = {
    xs: 'text-[9px] px-1 py-0.2',
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-0.5',
    xl: 'text-base px-3 py-1',
    '2xl': 'text-lg px-3.5 py-1'
  };

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 select-none ${className}`}
      aria-label="🌱 AgriShield AI"
    >
      {/* The ONLY graphical logo element: 🌱 */}
      <AgriShieldIcon
        size={size}
        withContainer={withContainer}
        className={iconClassName}
      />

      {/* Main Brand Text: AgriShield AI */}
      {showText && !iconOnly && (
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`tracking-tight ${textSizeMap[size] || textSizeMap.md} ${
              lightText ? 'text-white' : 'text-[#064D3B]'
            } ${textClassName}`}
          >
            AgriShield
          </span>

          <span
            className={`font-black uppercase tracking-wider rounded-md transition-colors ${aiBadgeMap[size] || aiBadgeMap.md} ${
              lightText
                ? 'bg-emerald-400/25 text-emerald-200 border border-emerald-300/30'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
            }`}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
};

export default AgriShieldLogo;
