export type SetType = 'warm-up' | 'drop-set' | 'failure' | 'normal';

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  type: SetType;
  isPR?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
}
