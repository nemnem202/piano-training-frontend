import { AppManager } from "../../../app/appManager";
import { Component } from "../../../core/abstract_classes/component";

export class Nav extends Component {
  private tags = ["", "SETTINGS", "NEW"];
  private elements = this.tags.map(() => document.createElement("div"));
  constructor() {
    super("nav", "");

    const router = AppManager.getInstance().router;

    this.content.className = "header-navbar";

    const configs: { el: HTMLDivElement; text: string; route: string }[] = [
      { el: this.elements[0], text: "Home", route: "" },
      { el: this.elements[1], text: "Settings", route: "settings" },
      { el: this.elements[2], text: "New", route: "new" },
    ];

    configs.forEach(({ el, text, route }) => {
      el.innerText = text;
      el.addEventListener("click", () => router?.redirect(route));
      this.content.appendChild(el);
    });
  }

  updatePage(pageTitle: string) {
    if (this.tags.includes(pageTitle.toUpperCase())) {
      const index = this.tags.indexOf(pageTitle.toUpperCase());
      this.elements.forEach((el, elIndex) => {
        if (index === elIndex) {
          el.className = "accent";
        } else {
          el.className = "secondary";
        }
      });
    } else {
      this.elements.forEach((e) => {
        e.className = "secondary";
      });
    }
  }
}
