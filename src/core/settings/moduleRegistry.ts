import { ChordNames } from "../../shared/modules/chordNames";
import { Piano } from "../../shared/modules/piano";
import type { ExerciceStore } from "../services/stores/exerciceStore";

export const moduleRegistry: Record<string, new (bounds: any, store: ExerciceStore) => any> = {
  ChordNames,
  Piano,
};
