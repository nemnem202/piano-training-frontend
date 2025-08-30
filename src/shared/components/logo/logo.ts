import { Component } from "../../../core/abstract_classes/component";

export class Logo extends Component {
  constructor() {
    super("div", "Music Sandbox");
    this.content.className = "logo";
  }
}
