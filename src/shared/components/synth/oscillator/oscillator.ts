import { Component } from "../../../../core/abstract_classes/component";
import { audioFileToFloat32Array } from "../../../../core/services/converters/sound-file-decoder/soundFileDecoder";
import { Knob } from "../../knob/knob";
import "./oscillator.css";

export class OscillatorComponent extends Component {
  fileDraggedInput = document.createElement("input");
  inputZone = document.createElement("div");
  constructor() {
    super("div", "");
    this.inputZone.style.width = "200px";
    this.inputZone.style.height = "150px";
    this.inputZone.style.backgroundColor = "blue";

    this.fileDraggedInput.type = "file";
    this.fileDraggedInput.accept = ".wav, .mp3";
    this.fileDraggedInput.style.display = "none";

    this.content.appendChild(this.inputZone);
    this.content.appendChild(this.fileDraggedInput);

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
      console.log(arr);
    } catch (err) {
      console.error(err);
    }
  }
}
