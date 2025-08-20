import { Page } from "../../core/abstract_classes/page";
import { PlaylistDAO } from "../../core/services/data/playlistDAO";
import type { PlaylistDTO } from "../../core/types/data";
import {
  IrealTypeDisplayer,
  ReadOnlyStrategy,
} from "../../shared/components/ireal_type_displayer/ireal_type_displayer";
import playlistPreviewTemplate from "./playlistPreview.html?raw";

export class PlaylistPreview extends Page {
  private title: string | null = null;
  private playlist: PlaylistDTO | null = null;
  private songIndex: number = 0;
  constructor(params: Record<string, string>) {
    super(playlistPreviewTemplate, "playlistPreview-Container", params);
    if (params.title) {
      this.title = params.title;
    }
    this.getPlaylist();
  }

  private async getPlaylist() {
    if (!this.title) {
      console.error("an error occurred, id is not defined");
      return;
    }

    await PlaylistDAO.get(this.title).then((playlist) => {
      if (playlist) {
        this.playlist = playlist;
        this.displaySong();
      } else {
        console.error("an error occurred, cannot read id");
        return;
      }
    });
  }

  private displaySong() {
    if (!this.playlist) return;

    this.content.innerHTML = "";

    const song = this.playlist.songs[this.songIndex % this.playlist.songs.length];

    const displayer = new IrealTypeDisplayer(song, new ReadOnlyStrategy());

    const navigationButtons = this.navigationButtons();

    this.content.appendChild(navigationButtons);
    this.content.appendChild(displayer.content);
  }

  private navigationButtons(): HTMLDivElement {
    const prevButton = document.createElement("div");
    const nextButton = document.createElement("div");

    const index = document.createElement("div");

    prevButton.innerText = "<";
    nextButton.innerText = ">";
    index.innerText = `${this.songIndex + 1}/${this.playlist?.songs.length}`;

    const container = document.createElement("div");
    container.style.display = "flex";

    container.appendChild(prevButton);
    container.appendChild(index);
    container.appendChild(nextButton);

    prevButton.addEventListener("click", () => {
      if (!this.playlist) return;
      this.songIndex =
        (this.songIndex - 1 + this.playlist.songs.length) % this.playlist.songs.length;

      this.displaySong();
    });

    nextButton.addEventListener("click", () => {
      if (!this.playlist) return;
      this.songIndex = (this.songIndex + 1) % this.playlist.songs.length;
      this.displaySong();
    });

    return container;
  }
}
