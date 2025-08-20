import type { ExerciceConfigDTO } from "../types/data";

export const DEFAULT_EXERCICE_CONFIG: ExerciceConfigDTO = {
  bpm: 120,
  key: "C",
  modules: [{ type: "ChordNames", params: { square: { height: 200, width: 300, x: 50, y: 50 } } }],
  magnetism: false,
};
