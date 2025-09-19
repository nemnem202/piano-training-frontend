import { Component } from "../../../common/abstracts/base_component";

export class RemoveButton extends Component {
  constructor(func: () => any | Promise<any>, container: HTMLElement, size: number = 10) {
    super("div", "");
    this.content.className = "remove-button";
    this.content.style.width = this.content.style.height = `${size}px`;

    this.content.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;

    this.content.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      func();
    });

    container.addEventListener("mouseenter", () => {
      this.content.style.opacity = "1";
    });

    container.addEventListener("mouseleave", () => {
      this.content.style.opacity = "0";
    });
  }
}
