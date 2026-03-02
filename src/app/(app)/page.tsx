"use client";

import React, { useState } from 'react';
import WorkoutLogger from '@/components/WorkoutLogger';
import ChallengeDashboard from '@/components/ChallengeDashboard';
import Leaderboard from '@/components/Leaderboard';
import PlateCalculator from '@/components/PlateCalculator';
import MuscleHeatmap from '@/components/MuscleHeatmap';
import WorkoutTemplates from '@/components/WorkoutTemplates';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [activeView, setActiveView] = useState<'home' | 'workout' | 'challenges' | 'groups' | 'calculator'>('home');

  const DATES = [
    { day: 'Mon', date: 11, active: false },
    { day: 'Tue', date: 12, active: false, ring: true },
    { day: 'Wed', date: 13, active: false },
    { day: 'Thu', date: 14, active: true },
    { day: 'Fri', date: 15, active: false },
    { day: 'Sat', date: 16, active: false },
    { day: 'Sun', date: 17, active: false, ring: true },
  ];

  return (
    <div className="flex-1 w-full max-w-md mx-auto bg-background min-h-screen text-foreground relative overflow-hidden">
      <AnimatePresence mode="wait">
        {activeView === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-5 space-y-6 pb-20"
          >
            {/* Header */}
            <div className="flex justify-between items-center pt-4">
              <h1 className="text-[34px] font-extrabold tracking-[-0.03em]">Planner</h1>
              <button className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition-colors">
                Manage
              </button>
            </div>

            {/* Date Scroller */}
            <div className="flex justify-between items-center px-1">
              {DATES.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className={`text-[13px] font-semibold ${d.active ? 'text-black dark:text-white' : 'text-gray-400'}`}>
                    {d.day}
                  </span>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[15px] font-bold transition-all ${
                    d.active ? 'bg-black text-white dark:bg-white dark:text-black font-extrabold transform scale-110 shadow-md' : 
                    d.ring ? 'border-2 border-gray-200 text-gray-700' :
                    'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}>
                    {d.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Workout Card */}
            <div className="card-soft space-y-5">
              <div className="flex justify-between items-start">
                <span className="font-semibold text-[15px]">Today's training</span>
                <button 
                  onClick={() => setActiveView('calculator')}
                  className="pill-button text-[13px]"
                >
                  Plate Calc
                </button>
              </div>
              
              <div className="space-y-1">
                <h2 className="text-[32px] font-bold tracking-tight leading-none">Chest, Biceps</h2>
              </div>
              
              <div className="flex justify-between items-end text-lg font-medium pt-2">
                <span>0 of 6 exercise</span>
                <span>1hr</span>
              </div>
              
              <button 
                onClick={() => setActiveView('workout')}
                className="pill-button-primary mt-2"
              >
                Start training
              </button>
            </div>

            {/* Weight / Analytics Card */}
            <div className="card-soft space-y-4">
              <div className="flex justify-between items-start">
                <span className="font-semibold text-[15px]">Weekly Volume</span>
                <button className="pill-button text-[13px]">Update</button>
              </div>
              
              <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-[40px] font-bold tracking-tighter leading-none">42.5</span>
                  <span className="text-2xl font-bold text-gray-400">k</span>
                </div>
                <ChevronUp className="w-5 h-5 mb-2" />
              </div>
              
              {/* Fake Graph */}
              <div className="relative h-24 w-full mt-4 border-l border-b border-gray-300 dark:border-gray-700 flex items-end">
                {/* Y Axis markings */}
                <div className="absolute -left-6 top-0 text-[10px] text-gray-400">50</div>
                <div className="absolute -left-6 bottom-1/2 text-[10px] text-gray-400">40</div>
                <div className="absolute -left-6 -bottom-2 text-[10px] text-gray-400">30</div>
                
                {/* SVG Line mimicking the reference image */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path 
                    d="M 0 80 Q 20 80, 40 60 T 60 55" 
                    fill="none" 
                    stroke="#FF3B30" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                  />
                </svg>
                
                {/* X Axis markings */}
                <div className="absolute -bottom-6 left-0 text-[10px] text-gray-400">14 Aug</div>
                <div className="absolute -bottom-6 left-1/2 text-[10px] text-gray-400">29 Aug</div>
                <div className="absolute -bottom-6 right-0 text-[10px] text-gray-400">14 Sep</div>
              </div>
            </div>

            {/* Workout Templates Slider */}
            <WorkoutTemplates />
            
            {/* Muscle Heatmap Analytics */}
            <MuscleHeatmap data={[{ id: 'chest', intensity: 0.85 }, { id: 'shoulders', intensity: 0.6 }, { id: 'quads', intensity: 0.4 }]} />

            {/* Quick Links for other features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button 
                onClick={() => setActiveView('challenges')}
                className="card-soft flex flex-col justify-center items-center gap-2 active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-black shadow-sm flex items-center justify-center text-xl">
                  🔥
                </div>
                <span className="font-semibold text-sm">Challenges</span>
              </button>
              
              <button 
                onClick={() => setActiveView('groups')}
                className="card-soft flex flex-col justify-center items-center gap-2 active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-black shadow-sm flex items-center justify-center text-xl">
                  🏆
                </div>
                <span className="font-semibold text-sm">Leaderboard</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* View Routing */}
        {activeView === 'workout' && (
           <motion.div 
             key="workout"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 20 }}
             className="min-h-screen bg-background"
           >
             <WorkoutLogger onBack={() => setActiveView('home')} />
           </motion.div>
        )}
        {activeView === 'challenges' && (
           <motion.div 
             key="challenges"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 20 }}
             className="min-h-screen bg-background"
           >
             <ChallengeDashboard onBack={() => setActiveView('home')} />
           </motion.div>
        )}
        {activeView === 'groups' && (
           <motion.div 
             key="groups"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 20 }}
             className="min-h-screen bg-background"
           >
             <Leaderboard onBack={() => setActiveView('home')} />
           </motion.div>
        )}
        {activeView === 'calculator' && (
           <motion.div 
             key="calculator"
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 50 }}
             className="min-h-screen bg-background p-5 pt-12"
           >
             <div className="mb-6">
                <button onClick={() => setActiveView('home')} className="pill-button">Back</button>
             </div>
             <PlateCalculator />
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
