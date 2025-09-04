import { PlaylistDAO } from "../services/data/playlistDAO";
import type { RouteGuard } from "../types/routes";

const checkSongId: RouteGuard = async (params: Record<string, string>): Promise<boolean> => {
  if (!params.id) return false;
  const song = await PlaylistDAO.get_song(params.id);
  return !!song;
};

export default checkSongId;
