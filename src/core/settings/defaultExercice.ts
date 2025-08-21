import type { ExerciceConfigDTO } from "../types/config";

export const DEFAULT_EXERCICE_CONFIG: ExerciceConfigDTO = {
  bpm: 120,
  key: "C",
  modules: [
    { type: "ChordNames", params: { bounds: { height: 200, width: 300, x: 50, y: 50 } } },
    { type: "Piano", params: { bounds: { height: 200, width: 300, x: 300, y: 300 } } },
  ],
  magnetism: false,
};
