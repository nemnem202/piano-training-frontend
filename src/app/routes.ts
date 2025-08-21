import { Exercice } from "../pages/exercice/exercice";
import { Home } from "../pages/home/home";
import { Create } from "../pages/create/create";
import { NotFound } from "../pages/not_found/notFound";
import { Settings } from "../pages/settings/settings";
import { PlaylistPreview } from "../pages/playlistPreview/playlistPreview";
import checkPlaylistId from "../core/guards/checkPlaylistTitle";
import { PlaylistPage } from "../pages/playlist/playlist";
import checkSongTitle from "../core/guards/checkSongTitle";
import type { Route } from "../core/types/routes";

const ROUTES: Route[] = [
  { path: "not-found", page: () => new NotFound(), header: true, footer: true },
  { path: "", page: () => new Home(), header: true, footer: true },
  { path: "settings", page: () => new Settings(), header: true, footer: true },
  {
    path: "exercices",
    children: [
      {
        path: ":title",
        children: [
          { path: ":songTitle", page: (params) => new Exercice(params), guard: checkSongTitle },
        ],
      },
    ],
  },
  { path: "create", page: () => new Create(), header: true, footer: true },
  {
    path: "playlist-preview",
    children: [
      { path: ":title", page: (params) => new PlaylistPreview(params), guard: checkPlaylistId },
    ],
  },
  {
    path: "playlist",
    header: true,
    footer: true,
    children: [
      {
        path: ":title",
        page: (params) => new PlaylistPage(params),
        guard: checkPlaylistId,
      },
    ],
  },
];

export default ROUTES;
