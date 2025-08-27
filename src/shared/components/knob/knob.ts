import { Component } from "../../../core/abstract_classes/component";
import template from "./knob.html?raw";
import "./knob.css";
import type { Position } from "../../../core/types/modules";

export class Knob extends Component {
  private knob: HTMLDivElement | null;
  private onMouseUp: ((e: MouseEvent) => void) | null = null;
  private onMouseMove: ((e: MouseEvent) => void) | null = null;
  private offset: Position = { x: 0, y: 0 };
  private angle: number = 0;
  public value: number = 50;
  private callback: (value: number) => void;

  constructor(callback: (value: number) => void) {
    super("div", template);
    this.knob = this.content.querySelector(".knob");
    this.callback = callback;
    if (!this.knob) return;

    this.content.style.height = "100%";
    this.content.style.aspectRatio = "1/1";

    // Ajoute l'écouteur mousedown
    this.knob.addEventListener("mousedown", (e) => this.listenMouseDown(e));
  }

  private listenMouseDown(e: MouseEvent) {
    this.offset = {
      x: e.clientX,
      y: e.clientY,
    };

    // Définir les callbacks

    this.onMouseMove = (e: MouseEvent) => {
      this.updateAngleAndValue(e);
    };

    this.onMouseUp = () => {
      if (this.onMouseMove) {
        window.removeEventListener("mousemove", this.onMouseMove);
        this.onMouseMove = null;
      }
      if (this.onMouseUp) {
        window.removeEventListener("mouseup", this.onMouseUp);
        this.onMouseUp = null;
      }
    };

    // Ajouter les listeners globaux
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
  }

  updateAngleAndValue(e: MouseEvent) {
    if (!this.knob) return;
    const deltaY = e.clientY - this.offset.y;
    this.offset.y = e.clientY;
    const sensitivity = 0.8;
    const newAngle = Math.max(Math.min(this.angle + deltaY * sensitivity, 140), -140);
    this.knob.style.transform = `rotate(${newAngle}deg)`;
    this.angle = newAngle;
    this.value = (this.angle / 140 + 1) * 50;
    this.callback(this.value);
  }
}
