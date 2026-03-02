"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface HeatmapProps {
  data: { date: string; status: 'completed' | 'missed' | 'none' }[];
}

export default function ChallengeHeatmap({ data }: HeatmapProps) {
  // Generate last 100 days
  const heatmapData = data.length > 0 ? data : Array.from({ length: 98 }, (_, i) => ({
    date: new Date(Date.now() - (97 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: Math.random() > 0.4 ? 'completed' : Math.random() > 0.6 ? 'missed' : 'none'
  }));

  return (
    <div>
      <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-black dark:bg-white" /> Done</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#FF3B30]" /> Missed</div>
      </div>
      
      <div className="overflow-x-auto scrollbar-hide py-1">
        <div className="flex flex-wrap gap-1.5 w-[320px]">
          {heatmapData.map((d, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.003 }}
              title={d.date}
              className={`w-3.5 h-3.5 rounded-[3px] transition-all hover:scale-125 cursor-pointer ${
                d.status === 'completed' ? 'bg-black dark:bg-white' :
                d.status === 'missed' ? 'bg-[#FF3B30]' :
                'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
