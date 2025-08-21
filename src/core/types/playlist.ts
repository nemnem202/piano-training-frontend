import type { ExerciceConfigDTO } from "./config";

export type PlaylistDTO = {
  title: string;
  songs: SongDTO[];
};

export type SongDTO = {
  title: string;
  composer: string;
  style: string;
  key: string;
  transpose: number;
  groove: string;
  bpm: number;
  repeats: number;
  cells: CellDTO[];
  exercice: ExerciceConfigDTO;
};

export type CellDTO = {
  annots: string[];
  comments: string[];
  bars: string;
  spacer: number;
  chord: ChordDTO | null;
};

export type ChordDTO = {
  note: string;
  modifiers: string;
  over: ChordDTO | null;
  alternate: ChordDTO | null;
};
