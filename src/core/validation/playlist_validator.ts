import type { Playlist } from "../../common/types/playlist";
import { PlaylistDAO } from "../data_acess/playlist_indexedDB_dao";

const checkPlaylistId = async (params: Record<string, string>): Promise<undefined | Playlist> => {
  const id = decodeURIComponent(params.id);
  if (!id) return undefined;
  const playlist = await PlaylistDAO.get_playlist(id);
  return playlist!!;
};

export default checkPlaylistId;
