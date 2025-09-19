import { AppRunner } from "../../app/app_runner";
import { Page } from "../../common/abstracts/base_page";
import { playlistTags } from "../../common/settings/playlist";
import { PlaylistDAO } from "../../core/data_acess/playlist_indexedDB_dao";
import { Spinner } from "../../ui_components/_base/spinner/spinner";
import { NewPlaylistButton } from "../../ui_components/buttons/new_playlist/new_playlist";
import { PlaylistPreviewCard } from "../../ui_components/forms/playlist-preview-card/playlist_preview_card";
import home from "./home_page.html?raw";

export class Home extends Page {
  constructor() {
    super(home, "home-container");
    this.displayPlaylists();
  }

  private async displayPlaylists() {
    const container = this.content.querySelector(".preview-playlists-container");

    if (!container) return;

    for (const tag of playlistTags) {
      const section = document.createElement("section");
      const title = document.createElement("h1");
      title.textContent = tag;
      title.classList.add("heading");

      const cardsContainer = document.createElement("div");
      cardsContainer.className = "playlist-card-container";

      const tagsPlaylists = await PlaylistDAO.get_all_with_tag(tag);

      if (tag === "Your playground") {
        const new_playlist = new NewPlaylistButton();
        cardsContainer.appendChild(new_playlist.content);
        new_playlist.content.addEventListener("click", () =>
          AppRunner.getInstance().router?.redirect("new")
        );
      }

      if (tagsPlaylists.length === 0) {
        console.warn("no playlist found for tag: ", tag);

        const spinner = new Spinner(50);

        const new_playlist = new NewPlaylistButton();

        new_playlist.content.innerHTML = "";

        new_playlist.content.appendChild(spinner.content);

        cardsContainer.appendChild(new_playlist.content);
      } else {
        for (const p of tagsPlaylists) {
          const card = new PlaylistPreviewCard(p);
          cardsContainer.appendChild(card.content);
        }
      }

      section.appendChild(title);
      section.appendChild(cardsContainer);

      container.appendChild(section);
    }
  }
}
