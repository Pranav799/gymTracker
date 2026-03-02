"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface MuscleData {
  id: string; // e.g. 'chest', 'biceps', 'quads'
  intensity: number; // 0 to 1
}

interface Props {
  data: MuscleData[];
}

// A simple abstraction of a human body, focusing on major muscle groups.
// In a real production app, this would be a complex multi-path SVG.
export default function MuscleHeatmap({ data }: Props) {
  // Helper to get color based on intensity
  const getColor = (id: string) => {
    const muscle = data.find(m => m.id === id);
    if (!muscle || muscle.intensity === 0) return 'currentColor'; // Uses currentColor (gray) if no intensity
    
    // Apple Fitness red/pink hue: hsl(346, 87%, 60%)
    // Interpolate opacity based on intensity
    return `rgba(255, 59, 48, ${0.2 + (muscle.intensity * 0.8)})`;
  };

  return (
    <div className="card-soft relative flex flex-col items-center p-6 space-y-4">
      <h3 className="w-full text-left font-semibold text-[17px]">Muscle Activation</h3>
      
      {/* Mock 2D SVG Body Map */}
      <div className="w-48 h-64 relative text-gray-200 dark:text-[#2c2c2e]">
        <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-sm">
          {/* Head & Neck */}
          <circle cx="50" cy="15" r="10" fill={getColor('neck')} className="transition-colors duration-500" />
          
          {/* Shoulders / Deltoids */}
          <path d="M 35 30 L 25 45 L 30 50 L 40 35 Z" fill={getColor('shoulders')} className="transition-colors duration-500" />
          <path d="M 65 30 L 75 45 L 70 50 L 60 35 Z" fill={getColor('shoulders')} className="transition-colors duration-500" />
          
          {/* Chest */}
          <path d="M 40 30 C 45 40, 55 40, 60 30 L 60 45 C 55 50, 45 50, 40 45 Z" fill={getColor('chest')} className="transition-colors duration-500" />
          
          {/* Abs / Core */}
          <rect x="42" y="50" width="16" height="25" rx="3" fill={getColor('core')} className="transition-colors duration-500" />
          
          {/* Biceps */}
          <ellipse cx="27" cy="55" rx="4" ry="8" fill={getColor('biceps')} className="transition-colors duration-500" />
          <ellipse cx="73" cy="55" rx="4" ry="8" fill={getColor('biceps')} className="transition-colors duration-500" />
          
          {/* Forearms */}
          <path d="M 23 65 L 20 80 L 25 80 L 27 65 Z" fill={getColor('forearms')} className="transition-colors duration-500" />
          <path d="M 77 65 L 80 80 L 75 80 L 73 65 Z" fill={getColor('forearms')} className="transition-colors duration-500" />
          
          {/* Quads / Thighs */}
          <path d="M 40 80 L 35 110 L 45 110 L 48 80 Z" fill={getColor('quads')} className="transition-colors duration-500" />
          <path d="M 60 80 L 65 110 L 55 110 L 52 80 Z" fill={getColor('quads')} className="transition-colors duration-500" />
          
          {/* Calves */}
          <path d="M 37 115 L 35 135 L 43 135 L 43 115 Z" fill={getColor('calves')} className="transition-colors duration-500" />
          <path d="M 63 115 L 65 135 L 57 135 L 57 115 Z" fill={getColor('calves')} className="transition-colors duration-500" />
        </svg>

        {/* Floating Stat Labels */}
        <motion.div 
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           className="absolute top-1/4 -left-4 bg-white dark:bg-black px-2 py-1 rounded-md text-[10px] font-bold shadow-sm pointer-events-none"
        >
          Chest 85%
        </motion.div>
        <motion.div 
           initial={{ opacity: 0, x: 10 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
           className="absolute bottom-1/3 -right-6 bg-white dark:bg-black px-2 py-1 rounded-md text-[10px] font-bold shadow-sm pointer-events-none"
        >
          Quads 40%
        </motion.div>
      </div>

      <p className="text-xs text-center text-gray-500 font-medium px-4">
        Your chest and shoulders are highly engaged this week. Consider adding lower body volume.
      </p>
    </div>
  );
}
