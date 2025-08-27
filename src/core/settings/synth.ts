import type { Oscillator, SynthConfig } from "../types/synth";

export const defaultOscillator: Oscillator = {
  enveloppe: {
    attack: 10,
    decay: 30,
    release: 30,
    decayLevel: 40,
  },
  filters: [],
  gain: 50,
  waveform: {
    title: "sin wave",
    data: [],
  },
};

export const defaultSynthConfig: SynthConfig = {
  bufferSize: 256,
  oscillators: [defaultOscillator],
  log: (params: string) => {
    console.log(params);
  },
};
