import type { ExerciceStore } from "../../core/state_management/exercice_state_store";
import { ChordGrid } from "../../features/exercice/floating_modules/chord_grid_module";
import { ChordNames } from "../../features/exercice/floating_modules/chord_names_module";
import { Piano } from "../../features/exercice/floating_modules/piano_module";
import { SynthetizerModule } from "../../features/exercice/floating_modules/synthetizer_module";
import type { Bounds } from "../types/floating_module";
import type { SynthConfig } from "../types/synth";

export const moduleEnum: Record<
  string,
  new (bounds: Bounds, store: ExerciceStore, synthConfig?: SynthConfig) => any
> = {
  ChordNames,
  Piano,
  SynthetizerModule,
  ChordGrid,
};
