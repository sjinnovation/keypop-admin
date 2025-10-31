import React from 'react';

type SizeKey = 'small' | 'medium' | 'large';

const CircularLoader = ({ size = 'medium', color = '#3b82f6' }) => {
  const sizeMap = {
    small: { overall: 40, dot: 4 },
    medium: { overall: 80, dot: 7 },
    large: { overall: 120, dot: 10 },
  };

  const { overall, dot } = sizeMap[size as SizeKey] || sizeMap.medium;
  const numDots = 16;
  const radius = (overall / 2) * 0.6; 

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>

      <svg width={overall} height={overall} viewBox={`0 0 ${overall} ${overall}`}>
        {[...Array(numDots)].map((_, index) => {
          const angle = (index / numDots) * 2 * Math.PI;
          const cx = overall / 2 + radius * Math.cos(angle);
          const cy = overall / 2 + radius * Math.sin(angle);
          const delay = index * 0.1;

          return (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={dot / 2}
              fill={color}
              opacity={0.2}
            >
              <animate
                attributeName="opacity"
                from="0.2"
                to="1"
                dur="1s"
                begin={`${delay}s`}
                repeatCount="indefinite"
                keyTimes="0;0.5;1"
                values="0.2;1;0.2"
              />
            </circle>
          );
        })}
      </svg>
      <p className='text-lg text-gray-700 font-plus-jakarta-sans text-[14px] font-medium leading-[33px] tracking-[0.01em] text-center'>
        Loading...
      </p>
    </div>
  );
};

export default CircularLoader;