"use client";

import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

const TEMPLATES = [
  { id: 1, title: 'Push Day', duration: '45 mins', exercises: 5, accent: 'bg-[#FF3B30]' },
  { id: 2, title: 'Leg Day', duration: '60 mins', exercises: 6, accent: 'bg-[#34C759]' },
  { id: 3, title: 'Pull & Biceps', duration: '50 mins', exercises: 5, accent: 'bg-[#007AFF]' },
];

export default function WorkoutTemplates() {
  return (
    <div className="card-soft space-y-4">
      <div className="flex justify-between items-center">
         <h4 className="font-semibold text-[17px]">Templates</h4>
         <button className="text-[13px] text-gray-500 font-semibold hover:text-black dark:hover:text-white transition-colors">
            See All
         </button>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {TEMPLATES.map((t, i) => (
          <motion.div 
            key={t.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="min-w-[140px] bg-white dark:bg-[#2c2c2e] p-4 rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between gap-4 group cursor-pointer active:scale-95 transition-all"
          >
            <div className="space-y-1">
              <div className={`w-3 h-3 rounded-full ${t.accent} mb-2`}/>
              <h5 className="font-bold text-[15px] leading-tight">{t.title}</h5>
              <p className="text-[11px] font-semibold text-gray-400">{t.duration} • {t.exercises} Ex</p>
            </div>
            
            <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors self-end">
              <Play className="w-4 h-4 ml-0.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
