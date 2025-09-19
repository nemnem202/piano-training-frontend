import { Component } from "../../../../common/abstracts/base_component";
import template from "./template.html?raw";

export class ExerciceMenu extends Component {
  constructor() {
    super("div", template);

    this.content.className = "exercice-menu";

    const svg = this.content.querySelector("svg");
    if (!svg) return;

    svg.addEventListener("click", () => {
      if (this.content.classList.contains("open")) {
        this.content.classList.remove("open");
      } else {
        this.content.classList.add("open");
      }
    });
  }
}
