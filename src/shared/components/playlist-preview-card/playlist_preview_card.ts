import { AppManager } from "../../../app/appManager";
import { Component } from "../../../core/abstract_classes/component";
import type { PlaylistDTO } from "../../../core/types/playlist";

export class PlaylistPreviewCard extends Component {
  constructor(p: PlaylistDTO) {
    super("div", "");
    this.content.className = "playlist-preview-card";
    this.content.innerHTML = `
    <div class="preview-img"></div>
    <div class="playlist-preview-card-title">${p.title}</div>
    <div class="playlist-preview-card-details">
    <div>${p.difficulty}</div>
    <div>${p.songsIDs.length}</div>
    </div>
    `;

    this.content.addEventListener("click", () => {
      AppManager.getInstance().router?.redirect(`playlist/${p.id}`);
    });
  }
}
