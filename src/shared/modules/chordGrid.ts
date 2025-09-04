import { Module } from "../../core/abstract_classes/module";
import type { ExerciceStore } from "../../core/services/stores/exerciceStore";
import type { Bounds } from "../../core/types/modules";
import type { Cell, Measure, Song } from "../../core/types/playlist";

const GRID_COLUMNS = 16;

export class ChordGrid extends Module {
  private gridContainer = document.createElement("div");
  private header = document.createElement("div");
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
    console.log("measures: ", this.song.measures);

    for (const [index, m] of this.song.measures.entries()) {
      this.fillMeasure(this.gridContainer, m, index);
    }

    this.change_selected_measure(0);
  }

  private fillMeasure(div: HTMLDivElement, m: Measure, index: number) {
    for (const cell of m.cells) {
      const box = document.createElement("div");
      box.className = `chord-grid-measure-box ${index}`;

      div.appendChild(box);
      this.add_start_bars(cell, box);
      this.add_chord(cell, box);
      this.add_end_bars(cell, box);
      this.add_annotations(cell, box);
      this.add_comments(cell, box);
    }
  }

  private createChild(container: HTMLDivElement, content: string, className?: string) {
    const el = document.createElement("div");
    el.innerText = content;
    el.className = className || "";
    container.appendChild(el);
  }

  private add_start_bars(cell: Cell, content: HTMLDivElement) {
    const startBarRegex = /[\{\(\[]/;
    if (startBarRegex.test(cell.bars)) {
      const bar = startBarRegex.exec(cell.bars);
      if (bar) {
        let child_content: string = "";
        switch (bar[0]) {
          case "{":
            child_content = "\uE000";
            break;
          case "(":
            child_content = "\uE030";
            break;
          case "[":
            child_content = "\uE031";
            break;
        }
        this.createChild(content, child_content, "start-bar");
      }
    } else {
      this.createChild(content, "", "start-bar");
    }
  }

  private add_chord(cell: Cell, content: HTMLDivElement) {
    if (!cell.chord) {
      this.createChild(content, "");
      return;
    }

    const { root, type } = cell.chord;
    const isRest = root.toUpperCase() === "X";

    if (isRest) {
      this.createChild(content, "\uE500", "musical");
    } else {
      this.createChild(content, `${root}${type}`);
    }
  }

  private add_annotations(cell: Cell, content: HTMLDivElement) {
    if (cell.annotations.length > 0) {
      const parts = cell.annotations.filter((a) => a.type === "Part");
      const keyChanges = cell.annotations.filter((a) => a.type === "KeyChange");
      const repeat = cell.annotations.filter((a) => a.type === "RepeatStart");
      const unk = cell.annotations.filter((a) => a.type === "unknown");
      // const repeatCorner = cell.annotations.find((a) => a.content?.toLowerCase() === "l");

      console.log(cell.annotations);

      parts.forEach((p) => {
        if (p.content)
          this.createChild(content, p.content.split("*")[1], "annotation part-annotation");
      });

      keyChanges.forEach((p) => {
        if (p.content) {
          const numbers = p.content.split("T")[1].split("");
          this.createChild(content, numbers[1] + "/" + numbers[2], "annotation part-annotation");
        }
      });

      repeat.forEach((p) => {
        if (p.content) this.createChild(content, "", "annotation repeat-annotation");
      });

      unk.forEach((p) => {
        if (p.content) {
          this.createChild(content, p.content.replace("N", ""), "annotation unk-annotation");
        }
      });

      // if (parts.length <= 0 && keyChanges.length <= 0 && unk.length<=0 ) {
      // }
    }
  }

  private add_comments(cell: Cell, content: HTMLDivElement) {
    if (cell.comments.length > 0) {
      cell.comments.forEach((c) => this.createChild(content, c, "comment"));
    }
  }

  private add_spacers(cell: Cell, content: HTMLDivElement) {
    if (
      cell.annotations.length <= 0 &&
      cell.bars === "" &&
      cell.chord === null &&
      cell.comments.length <= 0
    ) {
      this.createChild(content, "");
    }
  }

  private add_end_bars(cell: Cell, content: HTMLDivElement) {
    const endBarRegex = /[\}\)\]\Z]/;
    if (endBarRegex.test(cell.bars)) {
      const bar = endBarRegex.exec(cell.bars);
      if (bar) {
        let child_content: string = "";
        switch (bar[0]) {
          case ")":
            child_content = "\uE030";
            break;
          case "}":
            child_content = "\uE001";
            break;
          case "]":
            child_content = "\uE031";
            break;
          case "Z":
            child_content = "\uE032";
        }
        this.createChild(content, child_content, "end-bar");
      }
    } else {
      this.createChild(content, "", "end-bar");
    }
  }

  private change_selected_measure(index: number) {
    const boxes = this.gridContainer.querySelectorAll(".chord-grid-measure-box");
    for (const el of boxes) {
      if (el.classList.contains(`${index}`)) {
        el.classList.add("box-is-in-current-measure");
      } else {
        el.classList.remove("box-is-in-current-measure");
      }
    }
  }

  destroy(): void {}
}
