export type Sample = {
  title: string;
  data: Float32Array[];
};

export type Waveform = "sin" | "saw" | "triangle" | "square";

export type OscillatorType = "sampler" | "waveform";

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
  type: OscillatorType;
  enveloppe: Enveloppe;
  filters: Filter[];
  gain: number;
  sample?: Sample;
  waveform?: Waveform;
};

export type SynthConfig = {
  oscillators: Oscillator[];
  bufferSize: number;
  log: (params: string) => void;
};

export type Buffer = Float32Array;
