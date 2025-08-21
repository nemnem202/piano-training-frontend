import type { ModuleDTO } from "./modules";

export type NoteDTO =
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

export type ExerciceConfigDTO = {
  bpm: number;
  key: NoteDTO;
  modules: ModuleDTO[];
  magnetism: boolean;
};
