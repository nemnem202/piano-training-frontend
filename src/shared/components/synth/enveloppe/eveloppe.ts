import { Component } from "../../../../core/abstract_classes/component";
import type { Enveloppe, Oscillator } from "../../../../core/types/synth";
import { Knob } from "../../knob/knob";

export class EnveloppeComponent extends Component {
  canvas = document.createElement("canvas");
  enveloppe: Enveloppe;

  private canvasColumn = document.createElement("div");
  private knobsColumn = document.createElement("div");

  private width = 300; // largeur du canvas
  private height = 150; // hauteur du canvas
  private padding = 10; // marge pour les axes

  constructor(osc: Oscillator) {
    super("div", "");
    this.enveloppe = osc.enveloppe;
    this.initOverview();
    this.initKnobs();
    this.initCanvas();
    this.draw();
  }

  private initOverview() {
    this.content.style.display = "flex";
    this.content.style.height = "100%";
    this.content.style.alignItems = "center";
    this.content.style.justifyContent = "center";
    this.canvasColumn.style.flex = "1";
    this.knobsColumn.style.flex = "1";
    this.content.appendChild(this.canvasColumn);
    this.content.appendChild(this.knobsColumn);
  }

  private initCanvas() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = "100%";
    this.canvas.style.backgroundColor = "#111"; // fond sombre
    this.canvasColumn.appendChild(this.canvas);
  }

  private draw() {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    // nettoyage
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // styles généraux
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;

    // axes horizontaux
    ctx.beginPath();
    ctx.moveTo(this.padding, this.height - this.padding);
    ctx.lineTo(this.width - this.padding, this.height - this.padding);
    ctx.stroke();

    // axes verticaux
    ctx.beginPath();
    ctx.moveTo(this.padding, this.padding);
    ctx.lineTo(this.padding, this.height - this.padding);
    ctx.stroke();

    // placeholder enveloppe
    ctx.strokeStyle = "#0f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.padding, this.height - this.padding);
    ctx.lineTo(this.padding + this.enveloppe.attack, this.padding); // attack
    ctx.lineTo(
      this.padding + this.enveloppe.attack + this.enveloppe.decay,
      (100 - this.enveloppe.decayLevel + this.padding / 100) *
        ((this.height - this.padding * 2) / 100) +
        this.padding
    ); // decay
    ctx.lineTo(
      this.padding + this.enveloppe.attack + this.enveloppe.decay + this.enveloppe.release,
      this.height - this.padding
    ); // release
    ctx.stroke();
  }

  private initKnobs() {
    const knobGrid = document.createElement("div");
    knobGrid.style.width = "100px";
    knobGrid.style.display = "grid";
    knobGrid.style.gridTemplateColumns = "1fr 1fr";

    const attackKnob = new Knob((value: number) => {
      this.enveloppe.attack = value;
      this.draw();
    });

    const decayKnob = new Knob((value: number) => {
      this.enveloppe.decay = value;
      this.draw();
    });

    const decayLevelKnob = new Knob((value: number) => {
      this.enveloppe.decayLevel = value;
      this.draw();
    });

    const release = new Knob((value: number) => {
      this.enveloppe.release = value;
      this.draw();
    });

    knobGrid.appendChild(attackKnob.content);
    knobGrid.appendChild(decayKnob.content);
    knobGrid.appendChild(decayLevelKnob.content);
    knobGrid.appendChild(release.content);
    this.knobsColumn.appendChild(knobGrid);
  }
}
