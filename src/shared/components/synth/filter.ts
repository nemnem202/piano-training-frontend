import { Component } from "../../../core/abstract_classes/component";
import { filterOverviewFunctions } from "../../../core/settings/synth";
import type { Filter, FilterType } from "../../../core/types/synth";

export class FilterComponent extends Component {
  filter: Filter;
  public content: HTMLCanvasElement = document.createElement("canvas");
  private ctx: CanvasRenderingContext2D | null = null;
  constructor(filter: Filter) {
    super("canvas", "");
    this.filter = filter;
    this.ctx = this.content.getContext("2d");
    this.content.className = "filter-canvas";

    this.draw();
  }

  private draw() {
    if (!this.ctx) return;

    this.ctx.strokeStyle = "#ff7d00";
    this.ctx.lineWidth = 5;

    const fMin = 20;
    const fMax = 20000;

    for (let x = 0; x < this.content.width; x++) {
      const frac = x / this.content.width; // 0 → 1
      const freq = fMin * Math.pow(fMax / fMin, frac);
      const y = filterOverviewFunctions[this.filter.type](this.filter, freq);
      if (x === 0) {
        this.ctx.moveTo(x, y);
      }
      this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
  }
}
