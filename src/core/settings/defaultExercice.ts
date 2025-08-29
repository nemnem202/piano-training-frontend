import type { ExerciceConfigDTO } from "../types/config";

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
  ],
  magnetism: false,
};
