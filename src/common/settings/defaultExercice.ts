import type { ExerciceConfigDTO } from "../types/app-config";

export const DEFAULT_EXERCICE_CONFIG: ExerciceConfigDTO = {
  bpm: 120,
  key: "C",
  modules: [
    {
      type: "SynthetizerModule",
      params: {
        bounds: { height: 50, width: 50, x: 1, y: 1 },
      },
    },
    { type: "Piano", params: { bounds: { height: 20, width: 50, x: 50, y: 50 } } },
    { type: "ChordGrid", params: { bounds: { height: 50, width: 50, x: 20, y: 20 } } },
  ],
  magnetism: false,
};
