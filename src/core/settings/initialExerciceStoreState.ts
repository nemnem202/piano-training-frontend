import type { ExerciceStoreState } from "../types/exerciceStoreState";

export const initialExerciceStoreState: ExerciceStoreState = {
  chords: [],
  currentChord: 0,
  beat: 0,
  measure: 0,
  isPlaying: false,
};
