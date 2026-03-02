"use server";

import { supabase } from '@/lib/supabase';
import { WorkoutSet } from '@/types/workout';

/**
 * Log a single set to the database and check for PR.
 */
export async function logSet(workoutId: string, setData: Omit<WorkoutSet, 'id'>) {
  // 1. Insert the set
  const { data: insertedSet, error } = await supabase
    .from('sets')
    .insert({
      workout_id: workoutId,
      exercise_id: setData.exerciseId,
      weight: setData.weight,
      reps: setData.reps,
      type: setData.type,
      set_order: 1, // Simplified for now
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // 2. Check if this is a PR (Epley formula for 1RM comparison)
  const current1RM = setData.weight * (1 + setData.reps / 30);
  
  const { data: previousBest } = await supabase
    .from('sets')
    .select('weight, reps')
    .eq('exercise_id', setData.exerciseId)
    .lt('created_at', insertedSet.created_at)
    .order('weight', { ascending: false })
    .limit(1)
    .single();

  let isPR = false;
  if (!previousBest) {
    isPR = true;
  } else {
    const prev1RM = previousBest.weight * (1 + previousBest.reps / 30);
    if (current1RM > prev1RM) {
      isPR = true;
    }
  }

  // 3. Update PR status if true
  if (isPR) {
    await supabase
      .from('sets')
      .update({ is_pr: true })
      .eq('id', insertedSet.id);
  }

  return { set: insertedSet, isPR };
}

/**
 * Calculate 1RM using Epley Formula
 */
export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

/**
 * Get Weekly Volume for a user
 */
export async function getWeeklyVolume(userId: string) {
  const { data, error } = await supabase
    .from('sets')
    .select(`
      weight,
      reps,
      workouts!inner(user_id, started_at)
    `)
    .eq('workouts.user_id', userId)
    .gte('workouts.started_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  if (error) return 0;

  return data.reduce((total, set) => total + (set.weight * set.reps), 0);
}
