import type { difficultyPlaylist, playlistTags } from "../settings/playlist";
import type { ExerciceConfigDTO } from "./config";

export type Difficulty = (typeof difficultyPlaylist)[number];

export type PlaylistTag = (typeof playlistTags)[number];

export type Playlist = {
  id: string;
  title: string;
  tag: PlaylistTag;
  difficulty: Difficulty;
  songs: Song[];
  userNameOrigin?: string;
};

export type PlaylistDTO = {
  id: string;
  title: string;
  tag: PlaylistTag;
  difficulty: Difficulty;
  songsIDs: string[];
  userNameOrigin?: string;
};

export type Song = {
  id: string;
  userNameOrigin?: string;
  title: string;
  composer: string;
  style: string;
  key: string;
  transpose: number;
  groove: string;
  bpm: number;
  repeats: number;
  cells: Cell[];
  exercice: ExerciceConfigDTO;
};

export type Cell = {
  annots: string[];
  comments: string[];
  bars: string;
  spacer: number;
  chord: Chord | null;
};

export type Chord = {
  note: string;
  modifiers: string;
  over: Chord | null;
  alternate: Chord | null;
};
