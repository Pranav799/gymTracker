"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Timer, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkoutSet, SetType } from '@/types/workout';
import confetti from 'canvas-confetti';

interface Props {
  onBack?: () => void;
}

export default function WorkoutLogger({ onBack }: Props) {
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const activeExercise = "Chest, Biceps";

  // Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds default rest
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      // Optional: Play sound or haptic feedback here when timer reaches 0
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startTimer = () => {
    setTimeLeft(90);
    setTimerActive(true);
  };

  const addSet = () => {
    const newSet: WorkoutSet = {
      id: Math.random().toString(36).substr(2, 9),
      exerciseId: "chest-biceps",
      weight: 0,
      reps: 0,
      type: 'normal'
    };
    setSets([...sets, newSet]);
  };

  const updateSet = (id: string, updates: Partial<WorkoutSet>) => {
    setSets(sets.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeSet = (id: string) => {
    setSets(sets.filter(s => s.id !== id));
  };

  const toggleSetType = (id: string, type: SetType) => {
    updateSet(id, { type });
  };

  const handleCompleteSet = (s: WorkoutSet) => {
    // Start rest timer automatically
    startTimer();

    // PR Logic
    if (s.weight > 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#000000', '#eb3143'] // Black and pinkish-red
      });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-5 space-y-6 pt-12 relative pb-24">
      {/* Header */}
      <div className="flex justify-between items-center bg-background pb-4 z-10 sticky top-0">
        <div>
          <h2 className="text-[34px] font-extrabold tracking-[-0.03em] leading-none mb-1">
            Workout
          </h2>
          <p className="text-gray-500 font-medium text-sm">{activeExercise}</p>
        </div>
        {onBack && (
          <button onClick={onBack} className="pill-button">
            Done
          </button>
        )}
      </div>

      {/* Sets List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sets.map((set, index) => (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card-soft flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Set {index + 1}</span>
                
                {/* Type Toggles as pills */}
                <div className="flex gap-1.5 p-1 bg-white dark:bg-[#2c2c2e] rounded-full shadow-sm">
                  {(['warm-up', 'normal', 'drop-set', 'failure', 'superset'] as SetType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleSetType(set.id, t)}
                      role="button"
                      tabIndex={0}
                      className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all ${
                        set.type === t 
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' 
                          : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                    >
                      {t.substring(0, 4)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 bg-white dark:bg-[#2c2c2e] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                  <label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Weight (kg)</label>
                  <input
                    type="number"
                    value={set.weight || ''}
                    onChange={(e) => updateSet(set.id, { weight: parseFloat(e.target.value) })}
                    className="bg-transparent text-[32px] font-bold w-full outline-none leading-none mt-1"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1 bg-white dark:bg-[#2c2c2e] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                  <label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Reps</label>
                  <input
                    type="number"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(set.id, { reps: parseInt(e.target.value) })}
                    className="bg-transparent text-[32px] font-bold w-full outline-none leading-none mt-1"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700/50">
                <button 
                  onClick={() => handleCompleteSet(set)}
                  className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-full"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => removeSet(set.id)}
                  className="p-3 bg-white dark:bg-[#2c2c2e] text-[#FF3B30] rounded-full shadow-sm"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          onClick={addSet}
          className="pill-button-primary mt-4 py-5 flex justify-center items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Set
        </button>
      </div>

      {/* Floating Rest Timer */}
      <AnimatePresence>
        {timerActive && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
          >
            <div className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 border-2 border-[#FF3B30]/30 font-bold tracking-tight">
              <Timer className="w-5 h-5 text-[#FF3B30]" />
              <div className="flex flex-col">
                <span className="text-sm">Resting</span>
                <span className="text-2xl leading-none font-black text-[#FF3B30] tabular-nums">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="w-[1px] h-8 bg-gray-700 dark:bg-gray-300 mx-2" />
              <button 
                onClick={() => setTimerActive(false)}
                className="w-8 h-8 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
