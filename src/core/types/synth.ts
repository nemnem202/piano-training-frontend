export type Waveform = "sin" | "square" | "saw" | "sawtooth";

export type FilterType = "low-cut" | "high-cut" | "bell" | "low-shelf" | "high-shelf";

export type Filter = {
  type: FilterType;
  q: number;
  frequency: number;
  gain: number;
};

export type Enveloppe = {
  attack: number;
  decay: number;
  decayLevel: number;
  release: number;
};

export type Oscillator = {
  waveform: Waveform;
  enveloppe: Enveloppe;
  filters: Filter[];
  gain: number;
};

export type SynthConfig = {
  oscillators: Oscillator[];
  bufferSize: number;
  log: (params: string) => void;
};

export type Buffer = Float32Array;
