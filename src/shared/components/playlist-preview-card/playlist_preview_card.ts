import { AppManager } from "../../../app/appManager";
import { Component } from "../../../core/abstract_classes/component";
import type { Playlist } from "../../../core/types/playlist";
import { RemoveButton } from "../remove_button/removeButton";
import { RemoveSongModal } from "../removeSongModal/removeSongModal";

export class PlaylistPreviewCard extends Component {
  constructor(p: Playlist) {
    super("div", "");
    this.content.className = "playlist-preview-card";
    this.content.innerHTML = `
    <div class="preview-img"></div>
    <div class="playlist-preview-card-title">${p.title}</div>
    <div class="playlist-preview-card-details">
    <div>${p.difficulty}</div>
    <div>${p.songs.length}</div>
    </div>
    `;

    const remove_button = new RemoveButton(this.remove(p.Id), this.content, 30);

    this.content.appendChild(remove_button.content);

    this.content.addEventListener("click", () => {
      AppManager.getInstance().router?.redirect(`playlist/${p.Id}`);
    });
  }

  private remove = (id: string): any => {};
}
