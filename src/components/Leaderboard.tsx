"use client";

import React from 'react';
import { motion } from 'framer-motion';

const LEADERBOARD_DATA = [
  { id: 1, name: "Pranav", volume: "125,400", consistency: 98, avatar: "P" },
  { id: 2, name: "Sarah", volume: "112,200", consistency: 92, avatar: "S" },
  { id: 3, name: "Mike", volume: "98,500", consistency: 85, avatar: "M" },
  { id: 4, name: "Alex", volume: "84,000", consistency: 78, avatar: "A" },
];

interface Props {
  onBack?: () => void;
}

export default function Leaderboard({ onBack }: Props) {
  return (
    <div className="w-full max-w-md mx-auto p-5 space-y-6 pt-12 relative">
      <div className="flex justify-between items-center bg-white dark:bg-black pb-4 z-10 sticky top-0">
        <h2 className="text-[34px] font-extrabold tracking-[-0.03em] leading-none">
          Leaderboard
        </h2>
        {onBack && (
          <button onClick={onBack} className="pill-button">
             Done
          </button>
        )}
      </div>

      <div className="space-y-4">
        {LEADERBOARD_DATA.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`card-soft p-4 flex items-center justify-between shadow-sm border ${
                index === 0 ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10' : 'border-transparent'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-[#2c2c2e] shadow-sm flex items-center justify-center font-bold text-xl border border-gray-100 dark:border-gray-800">
                {user.avatar}
              </div>
              <div>
                <p className="font-bold text-lg">{user.name}</p>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-500">
                  <span>{user.volume} kg</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className={index === 0 ? 'text-yellow-600' : ''}>{user.consistency}% Done</span>
                </div>
              </div>
            </div>
            
            <span className="text-3xl font-extrabold text-gray-200 dark:text-gray-800 tabular-nums">
              {index + 1}
            </span>
          </motion.div>
        ))}
      </div>
      
      <button className="pill-button-primary mt-6">
         Invite Friends
      </button>
    </div>
  );
}
