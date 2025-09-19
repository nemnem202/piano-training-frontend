import { Page } from "../../common/abstracts/base_page";
import settings from "./settings_page.html?raw";

export class Settings extends Page {
  constructor() {
    super(settings);
  }
}
