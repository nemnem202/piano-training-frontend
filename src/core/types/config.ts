import type { ModuleDTO } from "./modules";

export const available_notes = [
  "C",
  "C#",
  "D",
  "D#",
  "Db",
  "E",
  "Eb",
  "F",
  "F#",
  "G",
  "Gb",
  "G#",
  "A",
  "A#",
  "Ab",
  "B",
  "Bb",
] as const;

export const DEFAULT_BPM = 100;

export type AvailableNote = (typeof available_notes)[number];

export type noteDTO = {
  value: number;
  velocity?: number;
};

export type ExerciceConfigDTO = {
  bpm: number;
  key: AvailableNote;
  modules: ModuleDTO[];
  magnetism: boolean;
};
