import { Component } from "../../../common/abstracts/base_component";
import footer from "./footer.html?raw";

export class Footer extends Component {
  constructor() {
    super("footer", footer);
  }
}
