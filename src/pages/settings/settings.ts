import { Page } from "../../core/abstract_classes/page";
import settings from "./settings.html?raw";

export class Settings extends Page {
  constructor() {
    super(settings);
  }
}
