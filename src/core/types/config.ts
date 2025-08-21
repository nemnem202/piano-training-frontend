import type { ModuleDTO } from "./modules";

export type AvailableNote =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "Db"
  | "E"
  | "Eb"
  | "F"
  | "F#"
  | "G"
  | "Gb"
  | "G#"
  | "A"
  | "A#"
  | "Ab"
  | "B"
  | "Bb";

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
