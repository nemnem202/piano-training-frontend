import { Page } from "../../core/contracts/page";
import notFound from "./notFound.html?raw";

export class NotFound extends Page {
  constructor() {
    super(notFound);
  }
}
