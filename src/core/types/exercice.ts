import type { noteDTO } from "./config";
import type { ChordDTO } from "./playlist";
import type { SynthConfig } from "./synth";

export type ExerciceStoreState = {
  synthConfig: SynthConfig;
  chords: ChordDTO[];
  currentChord: number;
  beat: number;
  measure: number;
  isPlaying: boolean;
  notes: noteDTO[];
};
