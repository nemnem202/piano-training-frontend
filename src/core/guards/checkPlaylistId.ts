import { PlaylistDAO } from "../services/data/playlistDAO";
import type { PlaylistDTO } from "../types/playlist";

const checkPlaylistTitle = async (
  params: Record<string, string>
): Promise<undefined | PlaylistDTO> => {
  const id = decodeURIComponent(params.id);
  if (!id) return undefined;
  const playlist = await PlaylistDAO.getPLaylist(id);
  console.log("coucou");
  return playlist!!;
};

export default checkPlaylistTitle;
