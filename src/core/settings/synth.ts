import type { SynthConfig } from "../types/synth";

export const defaultSynthConfig: SynthConfig = {
  bufferSize: 256,
  oscillators: [],
  log: (params: string) => {
    console.log(params);
  },
};
