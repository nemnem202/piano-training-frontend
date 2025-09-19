import { Component } from "../../../common/abstracts/base_component";
import type { RadioItems } from "../../../common/types/ui";

export class Radio extends Component {
  private btns: RadioItems;
  private btnsEl: Set<HTMLDivElement>;
  constructor(btns: RadioItems) {
    super("div", "");
    this.btns = btns;
    this.btnsEl = new Set();
    this.content.className = "radio-btns-container";

    for (const btn of this.btns) {
      const e = document.createElement("div");
      e.innerText = btn.value;
      e.className = "button1";
      this.btnsEl.add(e);
      this.content.appendChild(e);
      e.addEventListener("click", () => {
        for (const el of this.btnsEl) {
          if (el.classList.contains("selected")) {
            el.classList.remove("selected");
          }
        }
        e.classList.add("selected");

        btn.func();
      });
    }
  }
}
