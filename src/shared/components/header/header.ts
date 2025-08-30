import { Component } from "../../../core/abstract_classes/component";
import { Router } from "../../../app/router";
import { AppManager } from "../../../app/appManager";
import { Logo } from "../logo/logo";
import { Nav } from "../nav/nav";

export class Header extends Component {
  router: Router | null = null;
  constructor() {
    super("header", "");
    const router = AppManager.getInstance().router;
    this.router = router;

    const logo = new Logo();
    this.content.appendChild(logo.content);
    logo.content.addEventListener("click", () => this.router?.redirect(""));

    const navBar = new Nav();
    this.content.appendChild(navBar.content);
  }
}
