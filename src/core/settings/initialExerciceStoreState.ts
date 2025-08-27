import type { ExerciceStoreState } from "../types/exercice";
import { defaultOscillator, defaultSynthConfig } from "./synth";

export const initialExerciceStoreState: ExerciceStoreState = {
  synthConfig: defaultSynthConfig,
  chords: [],
  currentChord: 0,
  beat: 0,
  measure: 0,
  isPlaying: false,
  notes: [],
};
