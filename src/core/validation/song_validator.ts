import type { RouteGuard } from "../../common/types/router";
import { PlaylistDAO } from "../data_acess/playlist_indexedDB_dao";

const checkSongId: RouteGuard = async (params: Record<string, string>): Promise<boolean> => {
  if (!params.id) return false;
  const song = await PlaylistDAO.get_song(params.id);
  return !!song;
};

export default checkSongId;
