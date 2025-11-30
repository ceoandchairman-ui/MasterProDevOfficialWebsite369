import React, { useMemo } from 'react';

// Expects a `colors` prop, which is an array of 3 hex color strings.
// e.g., ['#00bf63', '#5271ff', '#ffb400']
// The colors are applied in order: [topWave, middleWave, bottomWave]
export default function WaveSeparator({ colors = ['#00bf63', '#5271ff', '#ffb400'] }) {
  // Destructure the colors array: top wave, middle wave, bottom wave
  const [topWaveColor, middleWaveColor, bottomWaveColor] = colors;

  return (
    <div className="relative w-full h-24 md:h-32 -mb-1" style={{ transform: 'translateY(1px)' }}>
      <svg
        className="absolute bottom-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        {/* Top Wave: Highest position */}
        <path
          fill="none"
          stroke={topWaveColor}
          strokeWidth="15"
          strokeLinecap="round"
          d="M0,96L80,122.7C160,149,320,203,480,213.3C640,224,800,192,960,170.7C1120,149,1280,139,1360,133.3L1440,128"
        ></path>
        
        {/* Middle Wave: Center position */}
        <path
          fill="none"
          stroke={middleWaveColor}
          strokeWidth="15"
          strokeLinecap="round"
          d="M0,192L60,170.7C120,149,240,107,360,112C480,117,600,171,720,197.3C840,224,960,224,1080,202.7C1200,181,1320,139,1380,117.3L1440,96"
        ></path>
        
        {/* Bottom Wave: Lowest position */}
        <path
          fill="none"
          stroke={bottomWaveColor}
          strokeWidth="15"
          strokeLinecap="round"
          d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,240C672,267,768,277,864,250.7C960,224,1056,160,1152,149.3C1248,139,1344,181,1392,202.7L1440,224"
        ></path>
      </svg>
    </div>
  );
}