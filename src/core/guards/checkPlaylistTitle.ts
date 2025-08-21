import { PlaylistDAO } from "../services/data/playlistDAO";
import type { PlaylistDTO } from "../types/playlist";

const checkPlaylistTitle = async (
  params: Record<string, string>
): Promise<undefined | PlaylistDTO> => {
  const title = decodeURIComponent(params.title);
  if (!title) return undefined;
  const playlist = await PlaylistDAO.get(title);
  return playlist ? playlist : undefined;
};

export default checkPlaylistTitle;
