import { Component } from "../../../core/abstract_classes/component";

export class Menu extends Component {
  value: any;
  menuItems: Record<string, any>;
  func: () => void;

  constructor(items: Record<string, any>, func: () => void) {
    super("select", "");
    this.content.className = "menu-container";
    this.menuItems = items;
    this.func = func;

    for (const [key, item] of Object.entries(this.menuItems)) {
      const opt = document.createElement("option");
      opt.value = String(item); // ⚠️ opt.value doit être une string
      opt.text = key;

      // si c’est la valeur initiale → on sélectionne
      if (item === this.value) {
        opt.selected = true;
      }

      this.content.appendChild(opt);
    }

    this.content.addEventListener("change", () => {
      this.value = (this.content as HTMLSelectElement).value; // ✅ maj de la prop
      this.func();
    });
  }
}
