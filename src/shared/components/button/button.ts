import { Component } from "../../../core/abstract_classes/component";

export class Button extends Component {
  constructor(
    value: string,
    onClick: () => void = () => {
      console.warn("a button with no callback function is pointless !!!");
    }
  ) {
    super("button", value);
    this.content.addEventListener("click", () => onClick());
  }
}
