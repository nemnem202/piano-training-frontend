import { PlaylistDAO } from "../services/data/playlistDAO";
import type { Playlist } from "../types/playlist";

const checkPlaylistTitle = async (
  params: Record<string, string>
): Promise<undefined | Playlist> => {
  const id = decodeURIComponent(params.id);
  if (!id) return undefined;
  const playlist = await PlaylistDAO.get_playlist(id);
  return playlist!!;
};

export default checkPlaylistTitle;
