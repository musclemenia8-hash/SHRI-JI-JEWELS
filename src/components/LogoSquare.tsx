import React from 'react';

interface LogoSquareProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

// User-supplied HD original logo asset
export const ORIGINAL_LOGO_PATH = '/assets/aistudio/IMG_20261112_144610_4413d601.jpg';

const SIZE_CLASSES = {
  xs: 'w-9 h-9 p-0.5',
  sm: 'w-12 h-12 sm:w-14 sm:h-14 p-1',
  md: 'w-16 h-16 p-1.5',
  lg: 'w-24 h-24 p-2',
  xl: 'w-36 h-36 p-3 sm:w-44 sm:h-44',
};

export const LogoSquare: React.FC<LogoSquareProps> = ({
  size = 'sm',
  className = '',
  showBorder = true,
}) => {
  return (
    <div
      className={`relative aspect-square shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-[#F2E7D5] ${
        showBorder ? 'border border-[#C5A36A]/60 shadow-sm' : ''
      } ${SIZE_CLASSES[size]} ${className}`}
      title="SHRI JI JEWELS — Divine By Tradition, Timeless By Trust"
    >
      <img
        src={ORIGINAL_LOGO_PATH}
        alt="SHRI JI JEWELS"
        className="w-full h-full object-contain select-none"
        loading="eager"
      />
    </div>
  );
};
