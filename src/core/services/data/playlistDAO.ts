import type { DBTypes } from "../../types/data";
import { openDB, type IDBPDatabase } from "idb";
import type { Playlist, PlaylistTag, Song } from "../../types/playlist";
import type { ExerciceConfigDTO } from "../../types/config";

export class PlaylistDAO {
  private static dbInstance: IDBPDatabase<DBTypes> | null = null;
  private static version = 1;

  private constructor() {}

  private static async getDB(): Promise<IDBPDatabase<DBTypes>> {
    if (!PlaylistDAO.dbInstance) {
      PlaylistDAO.dbInstance = await openDB("piano-trainingDB", PlaylistDAO.version, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("playlists")) {
            db.createObjectStore("playlists");
          }
          if (!db.objectStoreNames.contains("songs")) {
            db.createObjectStore("songs");
          }
        },
      });
    }
    return PlaylistDAO.dbInstance;
  }

  public static async create_playlist(playlist: Playlist): Promise<string> {
    const db = await PlaylistDAO.getDB();

    return await db.add("playlists", playlist, playlist.Id);
  }

  public static async create_song(song: Song): Promise<string> {
    const db = await PlaylistDAO.getDB();

    return await db.add("songs", song, song.id);
  }

  public static async get_playlist(id: string): Promise<Playlist | undefined> {
    const db = await PlaylistDAO.getDB();
    return await db.get("playlists", id);
  }

  public static async get_all_with_tag(tag: PlaylistTag): Promise<Playlist[]> {
    const db = await PlaylistDAO.getDB();
    const playlists = await db.getAll("playlists");
    return playlists.filter((p) => p.Tags.includes(tag));
  }

  public static async update_playlist(
    playlist: Playlist
  ): Promise<{ status: boolean; mssg: string }> {
    const db = await this.getDB();
    const transaction = db.transaction("playlists", "readwrite");
    const store = transaction.objectStore("playlists");

    const reqGet = await store.get(playlist.Id);

    if (!reqGet) return { status: false, mssg: "Cannot get item from id" };

    const updateReq = await store.put(playlist, playlist.Id);

    if (updateReq) {
      return { status: true, mssg: "Updated successfully" };
    } else {
      return { status: false, mssg: "An error occured while saving in the db" };
    }
  }

  public static async update_exercice_config(ex: ExerciceConfigDTO, id: string) {
    try {
      const db = await this.getDB();
      const transaction = db.transaction("songs", "readwrite");
      const store = transaction.objectStore("songs");

      const req_get = await store.get(id);

      if (!req_get) {
        console.error("song not found");
        return;
      }

      req_get.exercice_config = ex;

      const update_req = await store.put(req_get, id);
    } catch (err) {
      console.error(err);
    }
  }

  public static async get_song(id: string): Promise<Song | undefined> {
    const db = await PlaylistDAO.getDB();
    return await db.get("songs", id);
  }

  public static async get_all_songs_of_a_playlist(playlist: Playlist): Promise<Song[]> {
    const songs = [];
    for (const id of playlist.songs) {
      const song = await this.get_song(id);
      if (!song) continue;
      songs.push(song);
    }
    return songs;
  }
}
