import { Component } from "../../../core/abstract_classes/component";
import type { Enveloppe, Oscillator } from "../../../core/types/synth";
import { Knob } from "../knob/knob";

export class EnveloppeComponent extends Component {
  canvas = document.createElement("canvas");
  enveloppe: Enveloppe;

  private width = 300; // largeur du canvas
  private height = 150; // hauteur du canvas
  private padding = 10; // marge pour les axes

  constructor(osc: Oscillator) {
    super("div", "");
    this.enveloppe = osc.enveloppe;
    this.initOverview();
    this.initCanvas();
    this.initKnobs();

    this.draw();
  }

  private initOverview() {
    this.content.className = "enveloppe-container";
  }

  private initCanvas() {
    this.canvas.className = "enveloppe-canvas";
    // this.canvas.width = this.width;
    // this.canvas.height = this.height;
    // this.canvas.style.width = "100%";
    // this.canvas.style.backgroundColor = "#111";
    this.content.appendChild(this.canvas);
  }

  private draw() {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    // nettoyage
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // styles généraux
    ctx.strokeStyle = "#ffe5c1";
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
    ctx.strokeStyle = "#ff7d00";
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
    knobGrid.className = "enveloppe-knob-container";

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
    this.content.appendChild(knobGrid);
  }
}
