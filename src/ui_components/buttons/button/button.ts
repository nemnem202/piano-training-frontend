import { Component } from "../../../common/abstracts/base_component";

export class Button extends Component {
  constructor(
    value: string,
    onClick: () => void = () => {
      console.warn("a button with no callback function is pointless !!!");
    }
  ) {
    super("button", value);
    this.content.className = "button1";
    this.content.addEventListener("click", () => onClick());
  }
}
