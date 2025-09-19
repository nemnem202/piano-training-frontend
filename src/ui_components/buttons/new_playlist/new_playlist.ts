import { Component } from "../../../common/abstracts/base_component";

export class NewPlaylistButton extends Component {
  constructor() {
    super("div", "");
    this.content.className = "playlist-preview-card new-playlist";

    this.content.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3">
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
    </svg>`;
  }
}
