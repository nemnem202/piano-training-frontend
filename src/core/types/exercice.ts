import type { ChordDTO } from "./playlist";

export type ExerciceStoreState = {
  chords: ChordDTO[];
  currentChord: number;
  beat: number;
  measure: number;
  isPlaying: boolean;
};
