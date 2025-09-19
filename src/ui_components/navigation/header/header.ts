import type { Router } from "../../../app/app_router";
import { AppRunner } from "../../../app/app_runner";
import { Component } from "../../../common/abstracts/base_component";
import { Logo } from "../logo/logo";
import { Nav } from "../nav/nav";

export class Header extends Component {
  private router: Router | null = null;
  navBar: Nav;
  constructor() {
    super("header", "");
    const router = AppRunner.getInstance().router;
    this.router = router;

    const logo = new Logo();
    this.content.appendChild(logo.content);
    logo.content.addEventListener("click", () => this.router?.redirect(""));

    this.navBar = new Nav();
    this.content.appendChild(this.navBar.content);
  }
}
