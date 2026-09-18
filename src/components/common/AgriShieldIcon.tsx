import React from 'react';

export interface AgriShieldIconProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'white' | 'dark' | 'emerald';
  withContainer?: boolean;
  containerClassName?: string;
}

export const AgriShieldIcon: React.FC<AgriShieldIconProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  withContainer = false,
  containerClassName = ''
}) => {
  const emojiSizeMap = {
    xs: 'text-sm leading-none',
    sm: 'text-lg leading-none',
    md: 'text-2xl leading-none',
    lg: 'text-3xl leading-none',
    xl: 'text-4xl leading-none',
    '2xl': 'text-5xl leading-none'
  };

  const containerSizeMap = {
    xs: 'w-6 h-6 rounded-md',
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-2xl',
    '2xl': 'w-20 h-20 rounded-3xl'
  };

  const isWhite = variant === 'white';

  const symbol = (
    <span
      role="img"
      aria-label="Seedling"
      className={`inline-flex items-center justify-center select-none transform-gpu transition-transform hover:scale-105 ${emojiSizeMap[size] || emojiSizeMap.md} ${className}`}
    >
      🌱
    </span>
  );

  if (withContainer) {
    return (
      <div
        className={`inline-flex items-center justify-center shrink-0 ${containerSizeMap[size] || 'w-10 h-10'} ${
          isWhite
            ? 'bg-white/10 border border-white/20 shadow-xs'
            : 'bg-emerald-50 border border-emerald-200/80 shadow-xs'
        } ${containerClassName}`}
      >
        {symbol}
      </div>
    );
  }

  return symbol;
};

export default AgriShieldIcon;
