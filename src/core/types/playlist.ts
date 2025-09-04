import type { difficulties, playlistTags } from "../settings/playlist";
import type { ExerciceConfigDTO } from "./config";

export type Difficulty = (typeof difficulties)[number];

export type PlaylistTag = (typeof playlistTags)[number];

export type SongTag = string;

export type Id = string;

export type Key = { root: number; harm: string };

export type Armature = [number, number];

export type Playlist = {
  Id: Id;
  title: string;
  creation: number;
  last_modif: number;
  creator_username?: string;
  creator_Id?: Id;
  average_note?: string;
  user_note?: string;
  comments: Id[];
  version: number;
  songs: Id[];
  Tags: PlaylistTag[];
  public: boolean;
  downloads?: number;
  difficulty: Difficulty;
  genres?: string[];
};

export type Song = {
  id: Id;
  title: string;
  author: string;
  description?: string;
  tags: SongTag[];
  creator_username?: string;
  creator_Id?: string;
  creation: number;
  last_modif: number;
  difficulty: Difficulty;
  genre?: string;
  style?: string;
  exercice_config?: ExerciceConfigDTO;
  version: number;
  bpm: number;
  key: Key;
  armature: Armature;
  measures: Measure[];
  public: boolean;
};

export type annotationType =
  | "Part"
  | "RepeatStart"
  | "RepeatEnd"
  | "Coda"
  | "KeyChange"
  | "TimeChange"
  | "unknown";

export type annotation = {
  content?: string;
  type?: annotationType;
};

export type Chord = {
  root: string;
  type: string;
  notes?: number[];
  rootNote?: number[];
  over: Chord | null;
  alternate: Chord | null;
};

export type Note = {
  beat_start: number;
  beat_end: number;
  silent: boolean;
};

export type Cell = {
  comments: string[];
  annotations: annotation[];
  spacer: number;
  chord: Chord | null;
  bars: string;
};

export type Bar = "single" | "double" | "light-heavy" | "repeat-start" | "repeat-end";

export type Measure = {
  empty: boolean;
  cells: Cell[];
  notes: Note[];
};
// export type Cell = {
//   annots: string[];
//   comments: string[];
//   bars: string;
//   spacer: number;
//   chord: Chord | null;
// };

// export type Chord = {
//   note: string;
//   modifiers: string;
//   over: Chord | null;
//   alternate: Chord | null;
// };
