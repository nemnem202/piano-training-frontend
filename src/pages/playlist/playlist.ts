import { AppManager } from "../../app/appManager";
import { Page } from "../../core/abstract_classes/page";
import { PlaylistDAO } from "../../core/services/data/playlistDAO";
import { difficultyPlaylist } from "../../core/settings/playlist";
import type { PlaylistDTO, Song } from "../../core/types/playlist";
import template from "./playlist.html?raw";

export class PlaylistPage extends Page {
  id: string | undefined;
  playlist?: PlaylistDTO;

  constructor(params: Record<string, string>) {
    super(template, "playlist-page-container", params);
    this.id = decodeURIComponent(params.id);
    this.init(this.id);
  }

  private async init(id: string) {
    if (!id) return;
    const playlistDTO = await PlaylistDAO.getPLaylist(id);
    if (playlistDTO) {
      this.playlist = playlistDTO;
      this.showSongs(playlistDTO);
    }

    this.setTitle();
    this.setMenu();
  }

  private setTitle() {
    const input = this.content.querySelector("input");
    const mirror = this.content.querySelector("span");
    if (!input || !mirror) return;
    if (this.playlist) {
      input.value = this.playlist.title;
    } else {
      input.value = "My new Playlist";
    }
    // place le focus
    // met le curseur à la fin du texte
    const length = input.value.length;
    input.setSelectionRange(length, length);

    function resizeInput() {
      if (!input || !mirror) return;
      mirror.style.font = window.getComputedStyle(input).font;
      mirror.textContent = input.value;
      input.style.width = mirror.offsetWidth + 5 + "px";
    }
    setTimeout(() => {
      // redimensionne au chargement
      resizeInput();

      // redimensionne à chaque frappe
      input.addEventListener("input", resizeInput);
      input.addEventListener("focusout", () => this.updatePlaylistTitle(input.value));
    }, 1);
  }

  private async updatePlaylistTitle(title: string) {
    if (!this.playlist) return;
    this.playlist.title = title;
    PlaylistDAO.updatePlaylist(this.playlist).then((data) => {
      console.log(data.status);
      console.log(data.mssg);
    });
  }

  private setMenu() {
    const menu = this.content.querySelector(".menu");

    for (const [index, diff] of difficultyPlaylist.entries()) {
      const option = document.createElement("option");
      option.value = option.textContent = diff;

      if (option.value === this.playlist?.difficulty) {
        option.selected = true;
      }

      menu?.appendChild(option);
    }
  }

  private async showSongs(playlist: PlaylistDTO) {
    const songs = await PlaylistDAO.getAllSongsOfAPlaylist(playlist);
    const container = this.content.querySelector(".playlist-modules");
    if (!container) return;
    for (const song of songs) {
      const card = document.createElement("div");
      card.className = "module-preview";
      card.innerHTML += `

      <div class="module-preview-image"></div>
      <div class="module-preview-infos">
        <div class="module-preview-title-author">
          <div class="module-preview-title">${song.title}</div>
          <div class="module-preview-author">${song.composer}</div>
        </div>
        <div class="module-preview-key-bpm">
          <div class="module-preview-key">${song.key}</div>
          <div class="module-preview-bpm">${song.bpm}</div>
        </div>
      </div>

  `;
      container.appendChild(card);
      card.addEventListener("click", () => {
        AppManager.getInstance().router?.redirect(`exercices/${song.id}`);
      });
    }
  }
}
