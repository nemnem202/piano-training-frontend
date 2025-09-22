import type { Filter, FilterType, Oscillator, SynthConfig, Waveform } from "../types/synth";

export const defaultOscillator: Oscillator = {
  type: "waveform",
  enveloppe: {
    attack: 10,
    decay: 30,
    release: 30,
    decayLevel: 40,
  },
  filters: [],
  gain: 50,
  waveform: "sin",
};

export const defaultSynthConfig: SynthConfig = {
  bufferSize: 256,
  oscillators: [defaultOscillator],
  log: (params: string) => {
    console.log(params);
  },
};

export const waveFormFunctions: Record<Waveform, (x: number) => number> = {
  sin: (x) => {
    return Math.sin(x);
  },
  triangle: (x) => {
    const t = (x / (2 * Math.PI)) % 1; // Normalisation sur [0,1)
    return 4 * Math.abs(t - 0.5) - 1;
  },
  saw: (x) => {
    const t = x / (2 * Math.PI);
    return 2 * (t - Math.floor(t + 0.5));
  },
  square: (x) => {
    return Math.sign(Math.sin(x));
  },
};

export const filterOverviewFunctions: Record<FilterType, (filter: Filter, freq: number) => number> =
  {
    "low-cut": () => {
      return 5;
    },
    "high-cut": () => {
      return 10;
    },
    bell: () => {
      return 5;
    },
    "high-shelf": () => {
      return 8;
    },
    "low-shelf": () => {
      return 6;
    },
  };
