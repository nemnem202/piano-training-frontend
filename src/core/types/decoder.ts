export type PlaylistIreal = {
  title: string;
  songs: SongIreal[];
};

export type SongIreal = {
  title: string;
  composer: string;
  style: string;
  key: string;
  transpose: number;
  groove: string;
  bpm: number;
  repeats: number;
  cells: CellIreal[];
};

export type CellIreal = {
  annots: string[];
  comments: string[];
  bars: string;
  spacer: number;
  chord: ChordIreal | null;
};

export type ChordIreal = {
  note: string;
  modifiers: string;
  over: ChordIreal | null;
  alternate: ChordIreal | null;
};
