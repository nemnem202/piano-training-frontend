import { Exercice } from "../pages/exercice/exercice";
import { Home } from "../pages/home/home";
import { NotFound } from "../pages/not_found/notFound";
import { Settings } from "../pages/settings/settings";
import checkPlaylistId from "../core/guards/checkPlaylistId";
import { PlaylistPage } from "../pages/playlist/playlist";
import checkSongTitle from "../core/guards/checkSongId";
import type { Route } from "../core/types/routes";
import { newPlaylist } from "../pages/new_playlist/new_playlist";
import { LoadingPage } from "../pages/loading/loading";

const ROUTES: Route[] = [
  { path: "not-found", page: () => new NotFound(), header: true, footer: true },
  { path: "loading", page: () => new LoadingPage(), header: true, footer: true },
  { path: "", page: () => new Home(), header: true, footer: true },
  { path: "settings", page: () => new Settings(), header: true, footer: true },
  {
    path: "exercices",
    children: [{ path: ":id", page: (params) => new Exercice(params), guard: checkSongTitle }],
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
