import { ChordNames } from "../../shared/modules/chordNames";
import { Piano } from "../../shared/modules/piano";
import { SynthetizerModule } from "../../shared/modules/synthetizer";
import type { ExerciceStore } from "../services/stores/exerciceStore";
import type { Bounds } from "../types/modules";
import type { Oscillator, SynthConfig } from "../types/synth";

export const moduleRegistry: Record<
  string,
  new (bounds: Bounds, store: ExerciceStore, synthConfig?: SynthConfig) => any
> = {
  ChordNames,
  Piano,
  SynthetizerModule,
};
