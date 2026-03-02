"use client";

import React, { useState } from 'react';

const PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];

export default function PlateCalculator() {
  const [targetWeight, setTargetWeight] = useState(100);
  const barWeight = 20;

  const calculatePlates = () => {
    let weightPerSide = (targetWeight - barWeight) / 2;
    const result: number[] = [];

    if (weightPerSide < 0) return [];

    PLATES.forEach(plate => {
      while (weightPerSide >= plate) {
        result.push(plate);
        weightPerSide -= plate;
      }
    });

    return result;
  };

  const resultPlates = calculatePlates();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-black pb-4 z-10 sticky top-0">
        <h2 className="text-[34px] font-extrabold tracking-[-0.03em] leading-none">
          Plate Calc
        </h2>
      </div>

      <div className="card-soft space-y-6">
        <div className="space-y-1">
          <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Target Weight (kg)</label>
          <div className="flex items-center gap-4 bg-white dark:bg-[#2c2c2e] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
              className="bg-transparent text-[40px] font-bold w-full outline-none leading-none"
            />
            <div className="text-xs font-semibold text-gray-500 whitespace-nowrap bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
              Incl. {barWeight}kg bar
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700/50">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">PLATES PER SIDE</p>
          <div className="flex flex-wrap gap-2">
            {resultPlates.length > 0 ? (
              resultPlates.map((p, i) => (
                <div 
                  key={i}
                  className="w-14 h-14 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md flex items-center justify-center text-lg font-extrabold"
                >
                  {p}
                </div>
              ))
            ) : (
              <p className="text-sm font-semibold text-gray-400 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl w-full text-center">
                Add weight greater than bar.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
