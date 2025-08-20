import headerTemplate from "./header.html?raw";
import { Button } from "../button/button";
import { Component } from "../../../core/abstract_classes/component";
import { Router } from "../../../app/router";
import { ImportModal } from "../importModal/import";
import { AppManager } from "../../../app/appManager";

export class Header extends Component {
  router: Router | null = null;
  constructor() {
    super("header", headerTemplate);
    const router = AppManager.getInstance().router;
    this.router = router;
    const menuContainer = document.createElement("div");
    menuContainer.className = "header-menu-container";
    this.content.appendChild(menuContainer);
    const Home = new Button("Home", () => this.router!.redirect(""));
    menuContainer.appendChild(Home.content);
    const settings = new Button("Settings", () => this.router!.redirect("settings"));
    menuContainer.appendChild(settings.content);
    const importButton = new Button("Import", () => new ImportModal());
    menuContainer.appendChild(importButton.content);
  }
}
