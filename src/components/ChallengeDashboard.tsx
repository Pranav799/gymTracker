"use client";

import React from 'react';
import ChallengeHeatmap from './ChallengeHeatmap';

interface Props {
  onBack?: () => void;
}

export default function ChallengeDashboard({ onBack }: Props) {
  const progress = 68; // 68% complete
  const streak = 12;

  return (
    <div className="w-full max-w-md mx-auto p-5 space-y-6 pt-12 relative">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-black pb-4 z-10 sticky top-0">
        <h2 className="text-[34px] font-extrabold tracking-[-0.03em] leading-none">
          Challenges
        </h2>
        {onBack && (
          <button onClick={onBack} className="pill-button">
            Back
          </button>
        )}
      </div>

      {/* Hero Card */}
      <div className="card-soft relative overflow-hidden text-white bg-black dark:bg-[#1c1c1e] dark:border dark:border-gray-800">
        <div className="relative z-10 space-y-5">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold tracking-tight w-2/3">100 Day Summer Shred</h3>
            <div className="pill-button bg-white/20 backdrop-blur-md text-white border-0 text-[13px]">
              🔥 {streak} days
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-xs font-semibold text-gray-400">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Area */}
      <div className="card-soft space-y-4">
         <h4 className="font-semibold text-[17px]">Activity History</h4>
         <ChallengeHeatmap data={[]} />
      </div>

    </div>
  );
}
