import type { DBTypes } from "../../types/data";
import { openDB, type IDBPDatabase } from "idb";
import type { Playlist, PlaylistDTO, PlaylistTag, Song } from "../../types/playlist";

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

  public static async create(playlist: Playlist): Promise<string> {
    const db = await PlaylistDAO.getDB();

    const songs: string[] = [];

    for (const song of playlist.songs) {
      await db.add("songs", song, song.id);
      songs.push(song.id);
    }

    const playlistDTO: PlaylistDTO = {
      difficulty: playlist.difficulty,
      id: playlist.id,
      tag: playlist.tag,
      title: playlist.tag,
      songsIDs: songs,
    };

    return await db.add("playlists", playlistDTO, playlist.id);
  }

  public static async getPLaylist(id: string): Promise<PlaylistDTO | undefined> {
    const db = await PlaylistDAO.getDB();
    return await db.get("playlists", id);
  }

  public static async getAllWithTag(tag: PlaylistTag): Promise<PlaylistDTO[]> {
    const db = await PlaylistDAO.getDB();
    const playlists = await db.getAll("playlists");
    return playlists.filter((p) => p.tag === tag);
  }

  public static async updatePlaylist(
    playlistDTO: PlaylistDTO
  ): Promise<{ status: boolean; mssg: string }> {
    const db = await this.getDB();
    const transaction = db.transaction("playlists", "readwrite");
    const store = transaction.objectStore("playlists");

    const reqGet = await store.get(playlistDTO.id);

    if (!reqGet) return { status: false, mssg: "Cannot get item from id" };

    const updateReq = await store.put(playlistDTO, playlistDTO.id);

    if (updateReq) {
      return { status: true, mssg: updateReq };
    } else {
      return { status: false, mssg: "An error occured while saving in the db" };
    }
  }

  public static async getSong(id: string): Promise<Song | undefined> {
    const db = await PlaylistDAO.getDB();
    return await db.get("songs", id);
  }

  public static async getAllSongsOfAPlaylist(playlistDTO: PlaylistDTO): Promise<Song[]> {
    const songs = [];
    for (const id of playlistDTO.songsIDs) {
      const song = await this.getSong(id);
      if (!song) continue;
      songs.push(song);
    }
    return songs;
  }
}
