import React from 'react';

interface JMonogramProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOrbit?: boolean;
  interactive?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-8 h-8',
  md: 'w-14 h-14',
  lg: 'w-24 h-24',
  xl: 'w-36 h-36 sm:w-44 sm:h-44',
};

export function JMonogram({
  size = 'md',
  showOrbit = false,
  interactive = false,
  className = '',
}: JMonogramProps) {
  return (
    <span
      className={`relative inline-flex items-center justify-center select-none ${SIZE_MAP[size]} ${
        interactive
          ? 'group transition-transform duration-200 hover:scale-[1.03]'
          : ''
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        className="w-full h-full overflow-visible"
      >
        {showOrbit && (
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        )}
        <path
          d="M68 22V69.5C68 83.2 58.2 93 44.5 93C34.2 93 26.8 87.8 24 79.4L34.4 75.2C36.1 80.1 39.6 83 44.6 83C51.4 83 56 78.2 56 69.2V22H68Z"
          fill="currentColor"
        />
        <circle
          cx="86"
          cy="84"
          r="8.5"
          className="fill-[#5246D8] dark:fill-[#D3AC70] transition-transform duration-200 origin-center group-hover:scale-110"
        />
      </svg>
    </span>
  );
}
