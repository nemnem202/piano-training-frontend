// appManager.ts

import type { Page } from "../common/abstracts/base_page";
import type { Route } from "../common/types/router";
import { LoadingPage } from "../features/loading/loading_page";
import { Footer } from "../ui_components/navigation/footer/footer";
import { Header } from "../ui_components/navigation/header/header";
import type { Router } from "./app_router";

export class AppRunner {
  private static _instance: AppRunner | null = null;
  private app = document.createElement("div");
  private currentPage: Page | null = null;
  private header: Header | null = null;
  private footer: Footer | null = null;
  public router: Router | null = null;

  private constructor() {}

  public static getInstance() {
    if (!AppRunner._instance) {
      AppRunner._instance = new AppRunner();
    }
    return AppRunner._instance;
  }

  public init(router: Router) {
    this.app.id = "app";
    document.body.appendChild(this.app);

    this.router = router;
    this.router.redirect(this.router.getCurrentPath());
  }

  public get page() {
    return this.currentPage;
  }

  public setCurrentPage(route: Route, params: Record<string, string>) {
    if (!route.page) return;
    this.currentPage = route.page(params);

    this.handleHeaderAndFooter(route);

    this.showPage(this.currentPage);
  }

  private showPage(page: Page | null) {
    this.app.innerHTML = "";

    if (page) this.app.appendChild(page.content);
  }

  private handleHeaderAndFooter(route: Route) {
    if (route.header && !this.header) {
      this.header = new Header();
      document.body.appendChild(this.header.content);
    } else if (!route.header && this.header) {
      this.header.content.remove();
      this.header = null;
    }

    if (route.footer && !this.footer) {
      this.footer = new Footer();
      document.body.appendChild(this.footer.content);
    } else if (!route.footer && this.footer) {
      this.footer.content.remove();
      this.footer = null;
    }

    if (this.header && route.header) {
      this.header.navBar.updatePage(route.path);
    }
  }

  public showLoadingScreen() {
    this.showPage(new LoadingPage());
  }
}
