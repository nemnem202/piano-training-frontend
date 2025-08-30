import { AppManager } from "../../../app/appManager";
import { Component } from "../../../core/abstract_classes/component";

export class Nav extends Component {
  constructor() {
    super("nav", "");

    const router = AppManager.getInstance().router;

    this.content.className = "header-navbar";

    const home = document.createElement("div");
    const settings = document.createElement("div");
    const newMod = document.createElement("div");

    home.innerText = "Home";
    settings.innerText = "Settings";
    newMod.innerText = "New";

    home.className = "accent";
    settings.className = newMod.className = "secondary";

    this.content.appendChild(home);
    this.content.appendChild(settings);
    this.content.appendChild(newMod);

    home.addEventListener("click", () => router?.redirect(""));
    settings.addEventListener("click", () => router?.redirect("settings"));
    newMod.addEventListener("click", () => router?.redirect("new"));
  }
}
