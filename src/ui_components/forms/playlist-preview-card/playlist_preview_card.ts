import { AppRunner } from "../../../app/app_runner";
import { Component } from "../../../common/abstracts/base_component";
import type { Playlist } from "../../../common/types/playlist";
import { RemoveButton } from "../../buttons/remove_button/removeButton";
import { RemovePlaylist } from "../../modals/removePlaylistModal/removePlaylist";

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

    const remove_button = new RemoveButton(() => this.remove(p.Id, p.title), this.content, 30);

    this.content.appendChild(remove_button.content);

    this.content.addEventListener("click", () => {
      AppRunner.getInstance().router?.redirect(`playlist/${p.Id}`);
    });
  }

  private remove = (id: string, title: string): any => {
    const modal = new RemovePlaylist(id, title);
  };
}
