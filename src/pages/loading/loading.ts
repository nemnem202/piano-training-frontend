import { Page } from "../../core/abstract_classes/page";
import { Spinner } from "../../shared/components/spinner/spinner";

export class LoadingPage extends Page {
  constructor() {
    super("", "loading-page");
    console.log("[Loading...]");
    this.content.style.display = "flex";
    this.content.style.justifyContent = "center";
    this.content.style.alignItems = "center";
    this.content.style.height = "100%";
    this.content.style.width = "100%";
    this.content.style.marginTop = "100px";
    const spin = new Spinner(100);
    this.content.appendChild(spin.content);
  }
}
