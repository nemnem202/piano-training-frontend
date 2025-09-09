import { Component } from "../../../core/abstract_classes/component";
import { Browser } from "../../../core/services/search/browser";
import template from "./searchBar.html?raw";

export class SearchBar<T extends Record<string, unknown>> extends Component {
  private array: T[];
  private callback: (array: T[]) => any;

  constructor(key: keyof T, array: T[], callback: (array: T[]) => any) {
    super("div", template);

    this.content.className = "searchBar-container";
    this.array = array;
    this.callback = callback;

    const input = this.content.querySelector("#searchBarInput") as HTMLInputElement;

    if (!input) return;

    input.addEventListener("input", () => {
      if (input.value.length > 0) {
        const browsedArray = Browser.browse(input.value, key, this.array);
        this.callback(browsedArray);
      } else {
        this.callback(array);
      }
    });
  }
}
