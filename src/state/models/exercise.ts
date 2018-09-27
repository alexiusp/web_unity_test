export interface CurrentExercise {
  name: string;
  options: string;
  progress: number;
  settings: string;
};

// currently these are simple types but can be expanded in the future
export type ExerciseError = string;

export type ExerciseView = string;
