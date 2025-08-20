import { AppManager } from "../../app/appManager";
import { Page } from "../../core/abstract_classes/page";
import { PlaylistDAO } from "../../core/services/data/playlistDAO";
import type { PlaylistDTO, SongDTO } from "../../core/types/data";
import template from "./playlist.html?raw";

export class PlaylistPage extends Page {
  title: string | undefined;
  constructor(params: Record<string, string>) {
    super(template, "playlist-page-container", params);
    this.title = params.title;
    this.init(this.title);
  }

  private async init(title: string) {
    const playlist = await PlaylistDAO.get(title);
    if (playlist) {
      this.displayPlaylistHeader(playlist.title, playlist.songs.length);
      this.displayPlaylistScroll(playlist);
    }
  }

  private displayPlaylistScroll(playlist: PlaylistDTO) {
    const container = document.createElement("div");
    playlist.songs.forEach((s, index) => {
      container.appendChild(this.displaySong(s, index));
    });

    this.content.appendChild(container);
  }

  private displaySong(song: SongDTO, index: number): HTMLDivElement {
    const content = document.createElement("div");
    content.innerHTML = `
    <div>
    <span>${index + 1}</span>
    <h3>${song.title}</h3>
    <div>
    <span>${song.composer}</span>
    <span>${song.key}</span>
    <span>${song.bpm}</span>
    </div>
    </div>
    `;

    content.style.order = String(index);

    content.addEventListener("click", () => {
      AppManager.getInstance().router?.redirect(`exercices/${this.title}/${song.title}`);
    });
    return content;
  }

  private displayPlaylistHeader(title: string, length: number) {}
}
