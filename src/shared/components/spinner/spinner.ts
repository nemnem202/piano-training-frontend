import { Component } from "../../../core/abstract_classes/component";

export class Spinner extends Component {
  constructor(size: number) {
    super("div", "");
    this.content.className = "spinner";
    this.content.style.width = `${size}px`;
    this.content.style.height = `${size}px`;
    this.content.style.borderWidth = `${size / 10}px`;
  }
}
