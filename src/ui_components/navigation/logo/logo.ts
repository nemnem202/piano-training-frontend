import { Component } from "../../../common/abstracts/base_component";

export class Logo extends Component {
  constructor() {
    super("div", "Music Sandbox");
    this.content.className = "logo";
  }
}
