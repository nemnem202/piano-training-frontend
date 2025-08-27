import { Component } from "../../../../core/abstract_classes/component";
import { audioFileToFloat32Array } from "../../../../core/services/converters/sound-file-decoder/soundFileDecoder";
import type { Dimensions } from "../../../../core/types/modules";
import type { Oscillator } from "../../../../core/types/synth";
import { Knob } from "../../knob/knob";
import "./oscillator.css";

export class OscillatorComponent extends Component {
  private fileDraggedInput = document.createElement("input");
  private inputZone = document.createElement("div");
  private canvas = document.createElement("canvas");
  private oscillator: Oscillator;
  private viewDimensions: Dimensions = {
    width: 200,
    height: 150,
  };
  private padding = 10;
  constructor(oscillator: Oscillator) {
    super("div", "");
    this.content.style.position = "relative";
    this.oscillator = oscillator;

    this.initInput();
    this.listenInput();
    this.initCanvas();
    this.draw();
  }

  private initInput() {
    this.inputZone.style.width = `${this.viewDimensions.width}px`;
    this.inputZone.style.height = `${this.viewDimensions.height}px`;
    this.inputZone.style.backgroundColor = "transparent";
    this.inputZone.style.position = "absolute";
    this.inputZone.style.top = "0px";
    this.inputZone.style.left = "0px";
    this.inputZone.style.zIndex = "15";
    this.inputZone.style.opacity = "0.5";

    this.fileDraggedInput.type = "file";
    this.fileDraggedInput.accept = ".wav, .mp3";
    this.fileDraggedInput.style.display = "none";

    this.content.appendChild(this.inputZone);
    this.content.appendChild(this.fileDraggedInput);
  }

  private listenInput() {
    this.inputZone.addEventListener("dragenter", this.onDragEnter);
    this.inputZone.addEventListener("dragover", this.onDragOver);
    this.inputZone.addEventListener("dragleave", this.onDragLeave);
    this.inputZone.addEventListener("drop", this.onDrop);
    this.inputZone.addEventListener("click", this.onClick);
    this.fileDraggedInput.addEventListener("change", this.onFileDraggedInputChange);
  }

  private onClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.fileDraggedInput?.click();
  };

  private onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.inputZone.classList.add("dragover");
  };

  private onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  private onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.inputZone.classList.remove("dragover");
  };

  private onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.inputZone.classList.remove("dragover");

    if (e.dataTransfer?.files?.length) {
      this.getFile(e.dataTransfer.files[0]);
    }
  };

  private onFileDraggedInputChange = () => {
    if (this.fileDraggedInput?.files?.length) {
      this.getFile(this.fileDraggedInput.files[0]);
    }
  };

  private async getFile(file: File) {
    try {
      const arr = await audioFileToFloat32Array(file);

      this.oscillator.waveform = {
        title: file.name,
        data: arr,
      };
    } catch (err) {
      console.error(err);
    }
  }

  private initCanvas() {
    this.content.appendChild(this.canvas);
    this.canvas.width = this.viewDimensions.width;
    this.canvas.height = this.viewDimensions.height;
    this.canvas.style.width = `${this.viewDimensions.width}px`;
    this.canvas.style.height = `${this.viewDimensions.height}px`;
    this.canvas.style.backgroundColor = "red";
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0px";
    this.canvas.style.left = "0px";
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
    ctx.moveTo(this.padding, (this.viewDimensions.height - this.padding) / 2);
    ctx.lineTo(
      this.viewDimensions.width - this.padding,
      (this.viewDimensions.height - this.padding) / 2
    );
    ctx.stroke();

    // axes verticaux
    ctx.beginPath();
    ctx.moveTo(this.padding, this.padding);
    ctx.lineTo(this.padding, this.viewDimensions.height - this.padding);
    ctx.stroke();

    const interval = this.oscillator.waveform.data.length / this.viewDimensions.width;

    console.log("intervalle: ", interval);
  }
}
