import { Page } from "../../common/abstracts/base_page";
import notFound from "./not_found_page.html?raw";

export class NotFound extends Page {
  constructor() {
    super(notFound);
  }
}
