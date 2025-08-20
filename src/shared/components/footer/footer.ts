import type { Router } from "../../../app/router";
import { Component } from "../../../core/abstract_classes/component";
import footer from "./footer.html?raw";

export class Footer extends Component {
  constructor() {
    super("footer", footer);
  }
}
