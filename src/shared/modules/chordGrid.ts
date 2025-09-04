import { Module } from "../../core/abstract_classes/module";
import type { ExerciceStore } from "../../core/services/stores/exerciceStore";
import type { Bounds } from "../../core/types/modules";
import type { Cell, Measure, Song } from "../../core/types/playlist";

const GRID_COLUMNS = 4;

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
    console.log("measures: ", this.song.measures);

    for (const [index, m] of this.song.measures.entries()) {
      const measure = document.createElement("div");
      measure.className = "chord-grid-measure";
      this.fillMeasure(measure, m);
      this.gridContainer.appendChild(measure);
    }
  }

  private fillMeasure(div: HTMLDivElement, m: Measure) {
    const annots_line = document.createElement("div");
    const content_line = document.createElement("div");
    const comments_line = document.createElement("div");
    div.appendChild(annots_line);
    div.appendChild(content_line);
    div.appendChild(comments_line);
    annots_line.className =
      content_line.className =
      comments_line.className =
        "chord-grid-measure-line";

    content_line.classList.add("content");

    const startBarRegex = /[\{\(\[]/;
    const endBarRegex = /[\}\)\]]/;
    for (const cell of m.cells) {
      if (startBarRegex.test(cell.bars)) {
        const bar = startBarRegex.exec(cell.bars);
        if (bar) {
          let content: string = "";
          switch (bar[0]) {
            case "{":
              content = "\uE000";
              break;
            case "(":
              content = "\uE030";
              break;
            case "[":
              content = "\uE031";
              break;
          }
          this.createChild(content_line, content, "start-bar");
        }
      }

      if (cell.annotations.length > 0) {
        const parts = cell.annotations.filter((a) => a.type === "Part");
        const keyChanges = cell.annotations.filter((a) => a.type === "KeyChange");
        const unk = cell.annotations.filter((a) => a.type === "unknown");

        parts.forEach((p) => {
          if (p.content) this.createChild(annots_line, p.content, "part-annotation");
        });

        keyChanges.forEach((p) => {
          if (p.content) {
            const numbers = p.content.split("T")[1].split("");
            this.createChild(annots_line, numbers[1] + "/" + numbers[2], "part-annotation");
          }

          unk.forEach((p) => {
            if (p.content) {
              this.createChild(annots_line, p.content, "unknown-annot");
            }
          });
        });
      }

      if (cell.chord) {
        this.createChild(content_line, cell.chord.root + cell.chord.type);
      }

      if (cell.spacer > 0) {
        for (let i = 0; i < cell.spacer; i++) {
          this.createChild(content_line, "");
        }
      }

      if (endBarRegex.test(cell.bars)) {
        const bar = endBarRegex.exec(cell.bars);
        if (bar) {
          let content: string = "";
          switch (bar[0]) {
            case ")":
              content = "\uE030";
              break;
            case "}":
              content = "\uE001";
              break;
            case "]":
              content = "\uE031";
              break;
          }
          this.createChild(content_line, content, "start-bar");
        }
      }
    }
  }

  private createChild(container: HTMLDivElement, content: string, className?: string) {
    const el = document.createElement("div");
    el.innerText = content;
    el.className = className || "";
    container.appendChild(el);
  }

  destroy(): void {}
}
