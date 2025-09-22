import type { Filter, FilterType, Waveform } from "../types/synth";

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
