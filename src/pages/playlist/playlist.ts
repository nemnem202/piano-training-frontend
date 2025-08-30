import { AppManager } from "../../app/appManager";
import { Page } from "../../core/abstract_classes/page";
import { PlaylistDAO } from "../../core/services/data/playlistDAO";
import { difficultyPlaylist } from "../../core/settings/playlist";
import type { PlaylistDTO } from "../../core/types/playlist";
import template from "./playlist.html?raw";

export class PlaylistPage extends Page {
  title: string | undefined;
  constructor(params: Record<string, string>) {
    super(template, "playlist-page-container", params);
    this.title = decodeURIComponent(params.title);
    this.init(this.title);
  }

  private async init(title: string) {
    this.setTitle();
    this.setMenu();
    let playlist;
    if (title) {
      playlist = await PlaylistDAO.get(title);
    }
    this.showSongs(playlist);
  }

  private setTitle() {
    const input = this.content.querySelector("input");
    const mirror = this.content.querySelector("span");
    if (!input || !mirror) return;
    if (this.title) {
      input.value = this.title;
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
    }, 1);
  }

  private setMenu() {
    const menu = this.content.querySelector(".menu");

    for (const [index, diff] of difficultyPlaylist.entries()) {
      const option = document.createElement("option");
      option.value = option.textContent = diff;

      if (index === 0) {
        option.selected = true;
      }

      menu?.appendChild(option);
    }
  }

  private showSongs(playlist?: PlaylistDTO) {
    if (!playlist) return;
    const container = this.content.querySelector(".playlist-modules");
    if (!container) return;
    for (const song of playlist.songs) {
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
        AppManager.getInstance().router?.redirect(`exercices/${this.title}/${song.title}`);
      });
    }
  }
}
