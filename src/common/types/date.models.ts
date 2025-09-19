import type { DBSchema } from "idb";
import type { Playlist, Song } from "./playlist";

export interface DBTypes extends DBSchema {
  playlists: {
    key: string; // la clé est "id"
    value: Playlist; // la valeur complète stockée
  };
  songs: {
    key: string; //la clé est "id"
    value: Song;
  };
}
