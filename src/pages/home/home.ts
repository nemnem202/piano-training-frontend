import { Page } from "../../core/abstract_classes/page";
import home from "./home.html?raw";
import { playlistTags } from "../../core/settings/playlist";
import { PlaylistPreviewCard } from "../../shared/components/playlist-preview-card/playlist_preview_card";
import { PlaylistDAO } from "../../core/services/data/playlistDAO";

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

      const tagsPlaylists = await PlaylistDAO.getAllWithTag(tag);

      if (tagsPlaylists.length === 0) return;

      for (const p of tagsPlaylists) {
        const card = new PlaylistPreviewCard(p);
        cardsContainer.appendChild(card.content);
      }

      section.appendChild(title);
      section.appendChild(cardsContainer);

      container.appendChild(section);
    }
  }
}
