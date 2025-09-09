import { PlaylistDAO } from "../../../core/services/data/playlistDAO";
import { Button } from "../button/button";
import { Modal } from "../modal/modal";

export class RemovePlaylist extends Modal {
  constructor(id: string, title: string) {
    super(document.createElement("div"), "");
    this.child.className = "remove-playlist-modal-container";
    this.child.innerHTML = `
    <div></div>
    <div class="remove-playlist-modal-text">Are you shure to remove </br> "${title}" ?</div>
    `;

    const btn_container = document.createElement("div");
    btn_container.className = "remove-playlist-modal-btn-container";

    const remove_btn = new Button("Remove", () => {});
    const keep_btn = new Button("Keep", () => {});

    btn_container.appendChild(keep_btn.content);
    btn_container.appendChild(remove_btn.content);

    this.child.appendChild(btn_container);

    keep_btn.content.addEventListener("click", () => {
      this.destroy();
    });

    remove_btn.content.addEventListener("click", () => {
      PlaylistDAO.remove_playlist(id).then(() => window.location.reload());
    });
  }
}
