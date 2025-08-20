import { Page } from "../../core/abstract_classes/page";
import notFound from "./notFound.html?raw";

export class NotFound extends Page {
  constructor() {
    super(notFound);
  }
}
