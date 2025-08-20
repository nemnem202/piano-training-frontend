import { Page } from "../../core/abstract_classes/page";
import home from "./home.html?raw";
import "./home.css";
import { PlaylistDAO } from "../../core/services/data/playlistDAO";
import { AppManager } from "../../app/appManager";

export class Home extends Page {
  constructor() {
    super(home, "home-container");
    this.displayPlaylists();
  }

  private async displayPlaylists() {
    const container = this.content.querySelector(".preview-playlists-container");

    if (!container) return;

    const playlists = await PlaylistDAO.getAll();

    playlists.forEach((p) => {
      const playlistPreview = document.createElement("div");
      playlistPreview.className = "preview-playlist";
      playlistPreview.innerHTML = `
      <h4>${p.title}</h4>
      <span>songs: ${p.songs.length}</span>
      `;
      container.appendChild(playlistPreview);

      playlistPreview.addEventListener("click", () => {
        AppManager.getInstance().router?.redirect(`playlist/${p.title}`);
      });
    });

    const newPlaylist = document.createElement("div");
    newPlaylist.className = "preview-playlist";
    newPlaylist.innerHTML = `
      <h4>+</h4>
      <span>create new</span>
      `;
    container.appendChild(newPlaylist);
  }
}
