import type { noteDTO } from "./app-config";
import type { Chord } from "./playlist";
import type { SynthConfig } from "./synth";

export type ExerciceStoreState = {
  synthConfig: SynthConfig;
  chords: Chord[];
  currentChord: number;
  beat: number;
  measure: number;
  isPlaying: boolean;
  notes: noteDTO[];
};
