import type { RouteGuard } from "../types/routes";
import checkPlaylistId from "./checkPlaylistTitle";

const checkSongTitle: RouteGuard = async (params: Record<string, string>): Promise<boolean> => {
  const playlist = await checkPlaylistId(params);
  if (!playlist || !params.title) return false;
  const song = playlist.songs.find((s) => s.title === decodeURIComponent(params.songTitle));
  return !!song;
};

export default checkSongTitle;
