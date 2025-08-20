import type { Playlist } from "../converters/ireal-decoder/decoder";
import type { DBTypes, PlaylistDTO } from "../../types/data";
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
      title: playlist.name || "",
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
      title: playlist.name || "",
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
