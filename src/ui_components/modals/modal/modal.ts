import { Component } from "../../../common/abstracts/base_component";

export class Modal extends Component {
  protected child: HTMLElement;
  constructor(child: HTMLDivElement, template: string = "") {
    super("div", template);
    this.child = child;
    this.content.className = "modal-container";
    this.content.appendChild(this.child);
    document.body.appendChild(this.content);
    this.content.addEventListener("click", () => this.destroy());
  }

  protected destroy() {
    this.content.innerHTML = "";
    this.content.remove();
  }
}
