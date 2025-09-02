// router.ts

import type { Route } from "../core/types/routes";
import { AppManager } from "./appManager";

export class Router {
  private routes: Route[] = [];
  private app: AppManager;

  constructor(appManager: AppManager) {
    this.app = appManager;
  }

  public setRoutes(routes: Route[]) {
    this.routes = routes;

    window.addEventListener("popstate", () => {
      this.redirect(this.getCurrentPath());
    });
  }

  // router.ts
  public async redirect(path: string) {
    this.app.showLoadingScreen();

    const splitted = path.split("/").filter(Boolean);
    const splittedPath = splitted.length > 0 ? splitted : [""];
    const { route, params } = this.findRouteRecursive(splittedPath, this.routes);

    if (!route) {
      this.redirect("not-found");
      return;
    }

    if (route.guard) {
      const canEnter = await route.guard(params);
      if (!canEnter) {
        this.redirect("not-found");
        return;
      }
    }

    this.updateHistory(splittedPath);
    this.app.setCurrentPage(route, params);
  }

  private findRouteRecursive(
    pathSegments: string[],
    routes: Route[],
    params: Record<string, string> = {}
  ): { route?: Route; params: Record<string, string> } {
    if (!pathSegments.length) return { route: undefined, params };

    const [current, ...rest] = pathSegments;

    for (const route of routes) {
      let newParams = { ...params };

      if (route.path.startsWith(":")) {
        const paramName = route.path.slice(1);
        newParams[paramName] = current;
      } else if (route.path !== current) {
        continue; // pas de match
      }

      if (rest.length === 0) {
        return { route, params: newParams };
      }

      if (route.children) {
        const childResult = this.findRouteRecursive(rest, route.children, newParams);
        if (childResult.route) return childResult;
      }
    }

    return { route: undefined, params };
  }

  public getCurrentPath(): string {
    // Découpage + suppression des segments vides
    return window.location.pathname;
  }

  private updateHistory(path: string[]) {
    history.pushState({}, "", `/${path.join("/")}`);
  }
}
