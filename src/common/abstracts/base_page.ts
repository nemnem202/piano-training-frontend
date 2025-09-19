import { Component } from "./base_component";

export abstract class Page extends Component {
  protected params: Record<string, string> | undefined;
  constructor(template: string, className?: string, params?: Record<string, string>) {
    super("main", template);
    if (params) {
      this.params = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, decodeURIComponent(value)])
      );
    }
    if (className) {
      this.content.className = className;
    }
  }
}
