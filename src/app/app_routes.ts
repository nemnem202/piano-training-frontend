import type { Route } from "../common/types/router";
import checkPlaylistId from "../core/validation/playlist_validator";
import checkSongId from "../core/validation/song_validator";
import { Exercice } from "../features/exercice/exercice_page";
import { Home } from "../features/home/home_page";
import { LoadingPage } from "../features/loading/loading_page";
import { newPlaylist } from "../features/new_playlist/new_playlist_page";
import { NotFound } from "../features/not_found/not_found_page";
import { PlaylistPage } from "../features/playlist/playlist_page";
import { Settings } from "../features/settings/settings_page";

const ROUTES: Route[] = [
  { path: "not-found", page: () => new NotFound(), header: true, footer: true },
  { path: "loading", page: () => new LoadingPage(), header: true, footer: true },
  { path: "", page: () => new Home(), header: true, footer: true },
  { path: "settings", page: () => new Settings(), header: true, footer: true },
  {
    path: "exercices",
    children: [{ path: ":id", page: (params) => new Exercice(params), guard: checkSongId }],
  },
  {
    path: "new",
    footer: true,
    header: true,
    page: () => new newPlaylist(),
  },
  {
    path: "playlist",
    children: [
      {
        path: ":id",
        header: true,
        footer: true,
        page: (params) => new PlaylistPage(params),
        guard: checkPlaylistId,
      },
    ],
  },
];

export default ROUTES;
