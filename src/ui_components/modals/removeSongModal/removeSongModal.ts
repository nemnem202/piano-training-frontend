import { PlaylistDAO } from "../../../core/data_acess/playlist_indexedDB_dao";
import { Button } from "../../buttons/button/button";
import { Modal } from "../modal/modal";

export class RemoveSongModal extends Modal {
  remove_function: () => void;

  constructor(id: string, title: string, func: () => void) {
    super(document.createElement("div"), "");
    this.remove_function = func;
    this.child.className = "remove-song-modal-container";
    this.child.innerHTML = `
    <div></div>
    <div class="remove-song-modal-text">Are you shure to remove </br> "${title}" ?</div>
    `;

    const btn_container = document.createElement("div");
    btn_container.className = "remove-song-modal-btn-container";

    const remove_btn = new Button("Remove", () => {});
    const keep_btn = new Button("Keep", () => {});

    btn_container.appendChild(keep_btn.content);
    btn_container.appendChild(remove_btn.content);

    this.child.appendChild(btn_container);

    keep_btn.content.addEventListener("click", () => {
      this.destroy();
    });

    remove_btn.content.addEventListener("click", () => {
      PlaylistDAO.remove_song(id).then(() => this.remove_function());
    });
  }
}
