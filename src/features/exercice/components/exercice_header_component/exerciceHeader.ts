import type { Router } from "../../../../app/app_router";
import { AppRunner } from "../../../../app/app_runner";
import { Component } from "../../../../common/abstracts/base_component";
import { Nav } from "../../../../ui_components/navigation/nav/nav";

export class ExerciceHeader extends Component {
  router: Router | null = null;

  private inactivityTimer: number | null = null;
  private hideDelay = 3000;

  constructor() {
    super("div", "");

    const router = AppRunner.getInstance().router;
    this.router = router;

    const navBar = new Nav();
    this.content.appendChild(navBar.content);

    this.content.className = "exercie-header-nav";

    ["mousemove", "keydown", "scroll", "click"].forEach((event) => {
      window.addEventListener(event, () => this.resetInactivityTimer());
    });

    this.resetInactivityTimer();
  }
  private resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.content.style.opacity = "1";

    this.inactivityTimer = window.setTimeout(() => {
      this.hideHeader();
    }, this.hideDelay);
  }

  private hideHeader() {
    this.content.style.opacity = "0";
  }
}
