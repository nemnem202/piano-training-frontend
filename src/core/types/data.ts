import type { DBSchema } from "idb";
import type { PlaylistDTO } from "./playlist";

export interface DBTypes extends DBSchema {
  playlists: {
    key: string; // la clé est "title"
    value: PlaylistDTO; // la valeur complète stockée
  };
}
