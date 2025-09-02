import type { DBSchema } from "idb";
import type { PlaylistDTO, Song } from "./playlist";

export interface DBTypes extends DBSchema {
  playlists: {
    key: string; // la clé est "id"
    value: PlaylistDTO; // la valeur complète stockée
  };
  songs: {
    key: string; //la clé est "id"
    value: Song;
  };
}
