import type { DBTypes } from "../../types/data";
import type { PlaylistDTO } from "../../types/playlist";
import type { Playlist } from "../converters/ireal-decoder/decoder";
import { openDB, type IDBPDatabase } from "idb";

export class PlaylistDAO {
  private static dbInstance: IDBPDatabase<DBTypes> | null = null;
  private static version = 1;

  private constructor() {}

  private static async getDB(): Promise<IDBPDatabase<DBTypes>> {
    if (!PlaylistDAO.dbInstance) {
      PlaylistDAO.dbInstance = await openDB("piano-trainingDB", PlaylistDAO.version, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("playlists")) {
            db.createObjectStore("playlists", { keyPath: "title" });
          }
        },
      });
    }
    return PlaylistDAO.dbInstance;
  }

  public static async create(playlist: Playlist): Promise<string> {
    const db = await PlaylistDAO.getDB();

    // Étape 1 : ajoute l'objet sans id, IndexedDB génère le newId
    const id = await db.add("playlists", {
      title: playlist.title || "",
      songs: playlist.songs,
    });

    return id;
  }

  public static async get(title: string): Promise<PlaylistDTO | undefined> {
    const db = await PlaylistDAO.getDB();
    return await db.get("playlists", title);
  }

  public static async getAll(): Promise<PlaylistDTO[]> {
    const db = await PlaylistDAO.getDB();
    return await db.getAll("playlists");
  }

  public static async update(playlist: Playlist): Promise<string> {
    const playlistDto: PlaylistDTO = {
      title: playlist.title || "",
      songs: playlist.songs,
    };
    const db = await PlaylistDAO.getDB();
    return await db.put("playlists", playlistDto);
  }

  public static async delete(title: string): Promise<void> {
    const db = await PlaylistDAO.getDB();
    return await db.delete("playlists", title);
  }
}
