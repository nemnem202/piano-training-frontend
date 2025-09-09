import { ImportModal } from "../../shared/components/importModal/import";
import { PlaylistPage } from "../playlist/playlist";

export class newPlaylist extends PlaylistPage {
  constructor() {
    super({});

    const infos = this.content.querySelector(".playlist-infos");
    if (!infos) return;
    const import_btn = document.createElement("button");
    const save_btn = document.createElement("button");
    import_btn.className = "playlist-import-button button1";
    save_btn.className = "playlist-save-button button1";
    import_btn.innerText = "import";
    save_btn.innerText = "save";
    const container = document.createElement("div");
    container.appendChild(import_btn);
    container.appendChild(save_btn);
    infos.appendChild(container);

    import_btn.addEventListener("click", () => {
      new ImportModal();
    });

    const input = this.content.querySelector("input");
    input?.focus();
  }
}
