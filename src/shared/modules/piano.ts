import { Module } from "../../core/abstract_classes/module";
import { ExerciceStore } from "../../core/services/stores/exerciceStore";
import type { noteDTO } from "../../core/types/config";
import type { Bounds } from "../../core/types/modules";

const OCTAVES_NUMBER = 7;
const WHITE_KEYS = [1, 3, 5, 7, 9, 11, 13];
const BLACK_KEYS = [2, 4, 8, 10, 12];
const KEYS = ["q", "z", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j"];
const KEYS_MAP = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12];

export class Piano extends Module {
  private keysContainer = document.createElement("div");

  constructor(bounds: Bounds, store: ExerciceStore) {
    super(bounds, store);

    this.setupKeyboard();
    this.listenKeyboard();
    this.listenStore();
  }

  private setupKeyboard() {
    this.keysContainer.style.position = "absolute";
    this.keysContainer.style.width = "100%";
    this.keysContainer.style.height = "100%";
    this.keysContainer.style.overflowY = "auto";
    this.content.appendChild(this.keysContainer);

    for (let i = 1; i <= OCTAVES_NUMBER * 14; i++) {
      if (!WHITE_KEYS.includes(i % 14) && !BLACK_KEYS.includes(i % 14)) continue;

      const key = document.createElement("div");

      key.style.boxSizing = "border-box";
      key.style.top = "0";
      key.style.position = "absolute";

      if (WHITE_KEYS.includes(i % 14)) {
        key.style.backgroundColor = "white";
        key.style.height = "100%";
        key.style.zIndex = "4";
        key.style.border = "1px solid black";
        key.style.width = "50px";
        key.style.left = `${((i - 1) * 50) / 2}px`;
      } else if (BLACK_KEYS.includes(i % 14)) {
        key.style.width = "40px";
        key.style.left = `${((i - 1) * 50) / 2 + 5}px`;
        key.style.backgroundColor = "black";
        key.style.height = "50%";
        key.style.zIndex = "5";
        key.style.border = "1px solid white";
      }

      this.keysContainer.appendChild(key);
    }
  }

  private listenKeyboard() {
    window.addEventListener("keydown", (e) => {
      if (KEYS.includes(e.key.toLowerCase())) {
        const index = KEYS.indexOf(e.key.toLowerCase());
        this.store.addNote({ value: index + 3 * 12 });
      }
    });
    window.addEventListener("keyup", (e) => {
      if (KEYS.includes(e.key.toLowerCase())) {
        const index = KEYS.indexOf(e.key.toLowerCase());
        this.store.removeNote({ value: index + 3 * 12 });
      }
    });
  }

  private listenStore() {
    this.store.subscribe("notes", () => {
      const notes = this.store.getState("notes") as noteDTO[];

      this.colorNotes(notes);
      this.scrollOnCenter(notes);
    });
  }

  private colorNotes(notes: noteDTO[]) {
    this.keysContainer.querySelectorAll(".played").forEach((e) => e.classList.remove("played"));
    notes.forEach((n) => this.keysContainer.children[n.value].classList.add("played"));
  }

  private scrollOnCenter(notes: noteDTO[]) {
    const median = this.getMedianValue(notes);
    if (median === null) return;

    const medianNoteInKeyboard = this.keysContainer.children[median] as HTMLDivElement;

    if (!medianNoteInKeyboard) return;

    const offsetLeft = medianNoteInKeyboard.offsetLeft;
    const offsetWidth = medianNoteInKeyboard.offsetWidth;

    // Scroll uniquement dans le container, pas la fenêtre
    this.keysContainer.scrollTo({
      left: offsetLeft - this.keysContainer.clientWidth / 2 + offsetWidth / 2,
      behavior: "smooth",
    });
  }

  private getMedianValue(notes: noteDTO[]): number | null {
    if (notes.length === 0) return null;

    const values = notes.map((n) => n.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mid = Math.round((min + max) / 2);

    console.log(mid);

    return mid;
  }
}
