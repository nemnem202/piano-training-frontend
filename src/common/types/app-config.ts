import type { available_notes } from "../constants/available_notes";
import type { ModuleDTO } from "./floating_module";

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
