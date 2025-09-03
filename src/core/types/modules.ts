import type { Oscillator, SynthConfig } from "./synth";

export type Dimensions = {
  width: number;
  height: number;
};

export type Position = {
  x: number;
  y: number;
};

export interface Bounds extends Position, Dimensions {}

export type Corner = "nw" | "ne" | "sw" | "se";

export type Edge = "left" | "right" | "top" | "bottom";

export type ModuleDTO = {
  type: "ChordNames" | "Piano" | "SynthetizerModule" | "ChordGrid";
  params: {
    bounds: Bounds;
    synthConfig?: SynthConfig;
  };
};
