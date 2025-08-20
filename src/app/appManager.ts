// appManager.ts
import { Page } from "../core/abstract_classes/page";
import type { Route } from "../core/types/routes";
import { Footer } from "../shared/components/footer/footer";
import { Header } from "../shared/components/header/header";
import { Router } from "./router";

export class AppManager {
  private static _instance: AppManager | null = null;
  private app = document.createElement("div");
  private currentPage: Page | null = null;
  private header: Header | null = null;
  private footer: Footer | null = null;
  public router: Router | null = null;

  private constructor() {}

  public static getInstance() {
    if (!AppManager._instance) {
      AppManager._instance = new AppManager();
    }
    return AppManager._instance;
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
    this.currentPage = route.page(params);

    this.handleHeaderAndFooter(route);

    this.app.innerHTML = "";
    this.app.appendChild(this.currentPage.content);
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
  }
}
