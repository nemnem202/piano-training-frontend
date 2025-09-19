import { Component } from "../../../core/contracts/component";
import type { CellDTO, SongDTO } from "../../../core/types/data";
import template from "./template.html?raw";
import "./style.css";

interface DisplayStrategy {
  enhance(element: HTMLElement): void; // seulement les ajouts/modifs
}

export class ReadOnlyStrategy implements DisplayStrategy {
  enhance(element: HTMLElement): void {
    // Rien à faire → mode lecture seule
  }
}

/** --- 3. Stratégie Edit --- */
export class EditStrategy implements DisplayStrategy {
  enhance(element: HTMLElement): void {
    element.querySelectorAll("p").forEach((p) => {
      p.addEventListener("click", () => {});
    });
  }
}

export class IrealTypeDisplayer extends Component {
  private strategy: DisplayStrategy;
  private song: SongDTO;
  constructor(song: SongDTO, strat: DisplayStrategy) {
    super("div", template);
    this.strategy = strat;
    this.song = song;
    this.display();
  }

  private display() {
    const title = document.createElement("h1");
    title.textContent = this.song.title;

    const composer = document.createElement("h2");
    composer.textContent = this.song.composer;

    const style = document.createElement("h2");
    style.textContent = this.song.style;

    const cellsContainer = document.createElement("div");
    cellsContainer.className = "cells-container";

    this.song.cells.forEach((c) => {
      cellsContainer.appendChild(this.formatCell(c));
    });

    [title, composer, style, cellsContainer].forEach((e) => {
      this.content.appendChild(e);
    });
  }

  private formatCell(cell: CellDTO): HTMLDivElement {
    const cellDiv = document.createElement("div");
    cellDiv.className = "cell-div";
    cellDiv.innerHTML = `
    ${cell.annots.length > 0 ? `<div>${cell.annots}</div>` : ""}
    ${cell.comments.length > 0 ? `<div>${cell.comments}</div>` : ""}
    ${cell.bars.length > 0 ? `<div>${cell.bars}</div>` : ""}
    ${cell.spacer > 0 ? `<div>${cell.spacer}</div>` : ""}
    ${cell.chord ? `<div>${cell.chord.note} ${cell.chord.modifiers}</div>` : ""}
    `;
    return cellDiv;
  }
}
