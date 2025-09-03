import { Module } from "../../core/abstract_classes/module";
import type { ExerciceStore } from "../../core/services/stores/exerciceStore";
import type { Bounds } from "../../core/types/modules";
import type { Cell, Song } from "../../core/types/playlist";

const GRID_COLUMNS = 16;

export class ChordGrid extends Module {
  private gridContainer = document.createElement("div");
  private header = document.createElement("div");
  private gridMeasures: HTMLDivElement[] = [];
  private measuresStartEndIndexes: { start: number[]; end: number[] } = { start: [], end: [] };
  private song?: Song;
  constructor(bounds: Bounds, store: ExerciceStore) {
    super(bounds, store);
    this.header.className = "chord-grid-header";
    this.content.appendChild(this.header);
  }

  start() {
    this.song = this.container?.song;
    this.gridContainer.className = "chord-grid-container";
    this.gridContainer.style.gridTemplateColumns = `repeat(${GRID_COLUMNS}, 1fr)`;
    this.content.appendChild(this.gridContainer);

    if (!this.song) {
      this.gridContainer.innerText = "No chord";
      return;
    }

    let prevCell: Cell = { annots: [], bars: "", chord: null, comments: [], spacer: 0 };

    for (const [index, cell] of this.song.cells.entries()) {
      const boxWrapper = document.createElement("div");
      boxWrapper.className = "chord-grid-box";
      this.gridContainer.appendChild(boxWrapper);
      this.gridMeasures.push(boxWrapper);
      this.fillCell(cell, prevCell, index, boxWrapper);
      prevCell = cell;
    }

    this.changeSelectedMeasure(0);
  }

  private fillCell(cell: Cell, prevCell: Cell, index: number, container: HTMLDivElement) {
    console.log("[CELL] : ", cell);

    let leftBar = cell.bars.split("").filter((b) => b === "(" || b === "[" || b === "{");
    if (prevCell.bars.split("").includes(")") && !(index % GRID_COLUMNS === 0)) {
      leftBar = leftBar.filter((b) => b !== "(");
    }

    leftBar.forEach((lb) => this.addItem(lb, container));

    if (leftBar.length === 0) {
      this.addItem("", container);
    } else {
      this.measuresStartEndIndexes.start.push(index);
    }

    if (cell.chord) {
      const chord = cell.chord.note + cell.chord.modifiers;
      if (chord.toLowerCase() === "x") {
        this.addItem(chord, container, "chord-grid-empty-chord");
      } else {
        this.addItem(chord, container, "chord-grid-chord");
      }
    } else {
      this.addItem("", container);
    }

    const rightBar = cell.bars
      .split("")
      .filter((b) => b === ")" || b === "]" || b === "}" || b === "Z");
    rightBar.forEach((lb) => this.addItem(lb, container));
    if (rightBar.length === 0) {
      this.addItem("", container);
    } else {
      this.measuresStartEndIndexes.end.push(index);
    }
  }

  private addItem(value: string, container: HTMLDivElement, className?: string) {
    const item = document.createElement("span");
    if (className) item.className = className;
    item.innerText = this.convertToMusicalSymbol(value);
    // item.innerText = this.convertToMusicalSymbol(value);
    container.appendChild(item);
  }

  private convertToMusicalSymbol(value: string): string {
    const values = value.split("");
    for (let i = 0; i < values.length; i++) {
      switch (values[i]) {
        case "{":
          values[i] = "\uE040";
          break;
        case "}":
          values[i] = "\uE041";
          break;
        case ")":
        case "(":
          values[i] = "\uE030";
          break;
        case "[":
        case "]":
          values[i] = "\uE031";
          break;
        case "x":
          values[i] = "\uE500";
          break;
        case "Z":
          values[i] = "\uE032";
      }
    }
    return values.join(""); // sans virgules
  }

  public changeSelectedMeasure(index: number) {
    const measureStart = this.measuresStartEndIndexes.start[index];
    const measureEnd = this.measuresStartEndIndexes.end[index];
    for (let i = 0; i < this.gridMeasures.length; i++) {
      if (i >= measureStart && i <= measureEnd) {
        this.gridMeasures[i].classList.add("selected");
      } else {
        this.gridMeasures[i].classList.remove("selected");
      }
    }
  }

  destroy(): void {}
}
