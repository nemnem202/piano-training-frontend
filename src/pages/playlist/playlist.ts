import { AppManager } from "../../app/appManager";
import { Page } from "../../core/abstract_classes/page";
import { PlaylistDAO } from "../../core/services/data/playlistDAO";
import { difficultyPlaylist } from "../../core/settings/playlist";
import {
  difficulties,
  type Difficulty,
  type PlaylistDTO,
  type Song,
} from "../../core/types/playlist";
import { SearchBar } from "../../shared/components/searchBar/searchBar";
import template from "./playlist.html?raw";

export class PlaylistPage extends Page {
  private id: string | undefined;
  private playlist?: PlaylistDTO;
  private songs: Song[] = [];

  private updateTitleMssg = document.createElement("div");
  private currentPlaylistTitle: string = "";
  private menu = this.content.querySelector(".menu") as HTMLSelectElement;
  private menuUpdateMssg = document.createElement("div");

  // private songElements: Record<string, HTMLElement> = {};

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
      PlaylistDAO.getAllSongsOfAPlaylist(this.playlist).then((s) => {
        this.songs = s;
        this.showSongs(this.songs).then(() => this.setSearchBar());
      });
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
      this.currentPlaylistTitle = this.playlist.title;
    } else {
      input.value = "My new Playlist";
    }

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

    this.updateTitleMssg.className = "playlist-update-title-message";
    const titleContainer = this.content.querySelector(".playlist-title-container");
    if (!titleContainer) return;
    titleContainer.appendChild(this.updateTitleMssg);
  }

  private async updatePlaylistTitle(title: string) {
    if (!this.playlist || title === this.currentPlaylistTitle) return;
    this.playlist.title = title;
    PlaylistDAO.updatePlaylist(this.playlist).then((data) => {
      if (data.status === true) {
        this.updateTitleMssg.classList.remove("error");
        this.updateTitleMssg.classList.add("success");
        this.currentPlaylistTitle = title;
      } else {
        this.updateTitleMssg.classList.remove("success");
        this.updateTitleMssg.classList.add("error");
      }

      this.updateTitleMssg.innerText = data.mssg;
    });
  }

  private setMenu() {
    this.content.querySelector(".playlist-infos-container")?.appendChild(this.menuUpdateMssg);
    for (const [index, diff] of difficultyPlaylist.entries()) {
      const option = document.createElement("option");
      option.value = option.textContent = diff;

      if (option.value === this.playlist?.difficulty) {
        option.selected = true;
      }

      this.menu.appendChild(option);
    }

    this.menu.addEventListener("change", () => this.updatePlaylistDifficulty(this.menu.value));
  }

  private async updatePlaylistDifficulty(difficulty: string) {
    if (
      !this.menu ||
      !this.playlist ||
      !this.playlist.difficulty ||
      !difficulties.includes(difficulty as Difficulty)
    )
      return;

    this.playlist.difficulty = difficulty as Difficulty;

    const data = await PlaylistDAO.updatePlaylist(this.playlist);

    if (data.status === true) {
      this.menuUpdateMssg.className = "success";
    } else {
      this.menuUpdateMssg.className = "error";
    }

    this.menuUpdateMssg.innerText = data.mssg;
  }

  private setSearchBar() {
    const searchBar = new SearchBar(
      "title",
      this.songs,
      this.updateSearchBarFromBrowsedArray.bind(this)
    );
    this.content.querySelector(".playlist-infos")?.appendChild(searchBar.content);
  }

  private updateSearchBarFromBrowsedArray(array: Song[]) {
    console.log(array);
    this.showSongs(array);
  }

  private async showSongs(array: Song[]) {
    const container = this.content.querySelector(".playlist-modules");

    if (!container) return;
    container.innerHTML = `  <div class="new-module-button">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3">
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
    </svg>
  </div>`;
    for (const song of array) {
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
      // this.songElements[song.title] = card;
      container.appendChild(card);
      card.addEventListener("click", () => {
        AppManager.getInstance().router?.redirect(`exercices/${song.id}`);
      });
    }
  }
}
