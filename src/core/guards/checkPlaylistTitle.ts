import { PlaylistDAO } from "../services/data/playlistDAO";
import type { PlaylistDTO } from "../types/playlist";

const checkPlaylistTitle = async (
  params: Record<string, string>
): Promise<boolean | PlaylistDTO> => {
  const title = decodeURIComponent(params.title);
  if (!title) return false;
  const playlist = await PlaylistDAO.get(title);
  return playlist ? playlist : false;
};

export default checkPlaylistTitle;
