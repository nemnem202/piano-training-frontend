import { Component } from "../../../core/abstract_classes/component";
import template from "./template.html?raw";

export class PlaylistPreviewCard extends Component {
  constructor() {
    super("div", template);
    this.content.className = "playlist-preview-card";
  }
}
