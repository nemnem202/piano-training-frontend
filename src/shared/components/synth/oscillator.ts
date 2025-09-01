import { Component } from "../../../core/abstract_classes/component";
import { audioFileToFloat32Array } from "../../../core/services/converters/sound-file-decoder/soundFileDecoder";
import { waveFormFunctions } from "../../../core/settings/synth";
import type { Dimensions } from "../../../core/types/modules";
import type { Oscillator, Waveform } from "../../../core/types/synth";

export class OscillatorComponent extends Component {
  private fileDraggedInput = document.createElement("input");

  private importBtn = document.createElement("div");
  private canvas = document.createElement("canvas");
  private leftColumn = document.createElement("div");
  private rightColumn = document.createElement("div");

  private oscillator: Oscillator;
  private viewDimensions: Dimensions = { width: 200, height: 150 };
  private paddingSides = 5;
  private paddingTopBottom = 10;

  private dpr = Math.max(1, window.devicePixelRatio || 1);
  private ctx: CanvasRenderingContext2D | null = null;
  private thumbnails = new Map<Waveform, ImageBitmap | HTMLCanvasElement>();
  private drawRequested = false;

  private zoomY = 1;
  private start = 0;
  private end = 0;

  private bound = {
    onClickInput: (e: MouseEvent) => this.onClick(e),

    onFileChange: () => this.onFileDraggedInputChange(),
    onRightColumnClick: (e: MouseEvent) => this.onRightColumnClick(e),
  };

  constructor(oscillator: Oscillator) {
    super("div", "");
    this.oscillator = oscillator;

    this.content.className = "osc-container";
    this.leftColumn.className = "osc-left-column";
    this.rightColumn.className = "osc-right-column";

    this.content.appendChild(this.leftColumn);
    this.content.appendChild(this.rightColumn);

    this.initInput();
    this.listenInput();

    this.initImportBtn();
    this.listenImportBtn();

    this.initCanvas();
    this.listenCanvas();

    this.createSelectableWaves();
    this.scheduleDraw();
  }

  private initInput() {
    this.fileDraggedInput.type = "file";
    this.fileDraggedInput.accept = ".wav, .mp3";
    this.fileDraggedInput.style.display = "none";

    this.leftColumn.appendChild(this.fileDraggedInput);
  }

  private listenInput() {
    this.fileDraggedInput.addEventListener("change", this.bound.onFileChange);

    this.rightColumn.addEventListener("click", this.bound.onRightColumnClick);
  }

  private onClick(e: MouseEvent) {
    e.stopPropagation();
    this.fileDraggedInput.click();
  }

  private onFileDraggedInputChange() {
    const file = this.fileDraggedInput.files?.[0];
    if (file) this.getFile(file);
  }

  private async getFile(file: File) {
    try {
      const arr = await audioFileToFloat32Array(file);
      this.oscillator.sample = { title: file.name, data: arr };
      this.oscillator.type = "sampler";
      this.oscillator.waveform = undefined;
      this.scheduleDraw();
    } catch (err) {
      console.error("Error decoding audio file:", err);
    }
  }

  private initImportBtn() {
    this.importBtn.className = " button1";
    this.importBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M168-192q-32 0-52-21.16t-20-50.88v-432.24Q96-726 116-747t52-21h216l96 96h313q31 0 50.5 21t21.5 51H451l-96-96H168v432l78-264h690l-85 285q-8 23-21 37t-38 14H168Zm75-72h538l59-192H300l-57 192Zm0 0 57-192-57 192Zm-75-336v-96 96Z"/></svg>';
    this.rightColumn.appendChild(this.importBtn);
  }

  private listenImportBtn() {
    this.importBtn.addEventListener("click", this.bound.onClickInput);
  }

  private initCanvas() {
    this.leftColumn.appendChild(this.canvas);
    this.canvas.className = "osc-main-preview-canvas";
    const { width, height } = this.viewDimensions;
    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);

    this.ctx = this.canvas.getContext("2d");
    if (this.ctx) {
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
  }

  private scheduleDraw() {
    if (this.drawRequested) return;
    this.drawRequested = true;
    requestAnimationFrame(() => {
      this.drawRequested = false;
      this.draw();
    });
  }

  private listenCanvas() {
    let ctrlDown = false;

    window.addEventListener("keydown", (e) => {
      if (e.key === "Control") ctrlDown = true;
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "Control") ctrlDown = false;
    });

    this.canvas.addEventListener(
      "wheel",
      (e: WheelEvent) => {
        e.preventDefault();
        this.adaptSampleview(e.deltaX, e.deltaY, ctrlDown);
      },
      { passive: false }
    );
  }

  private adaptSampleview(x: number, y: number, ctrl: boolean) {
    if (ctrl) {
      this.zoomY += y / 10;
    } else {
      this.start += y * 100;
      this.end += y * 100;

      this.start += x;
      this.end -= x;
    }

    console.log("s", this.start, "e", this.end);

    this.draw();
  }

  private draw() {
    if (!this.ctx) return;

    const { width, height } = this.viewDimensions;
    this.ctx.clearRect(0, 0, width, height);

    this.ctx.save();
    this.ctx.strokeStyle = "#444";
    this.ctx.lineWidth = 1;

    if (this.oscillator.type === "waveform" && this.oscillator.waveform) {
      this.drawWave(this.ctx, this.oscillator.waveform, width, height, 2);
    } else if (this.oscillator.type === "sampler" && this.oscillator.sample) {
      this.drawSample(
        this.ctx,
        this.oscillator.sample.data[0],
        this.start,
        this.oscillator.sample.data[0].length - this.end,
        this.zoomY
      );
    }

    this.ctx.restore();
  }

  private drawWave(
    ctx: CanvasRenderingContext2D,
    wave: Waveform,
    width: number,
    height: number,
    lineWidth: number
  ) {
    const drawableWidth = Math.max(1, width - this.paddingSides * 2);
    const centerY = height / 2;
    const func = waveFormFunctions[wave];
    const amplitude = (height - this.paddingTopBottom * 2) / 2;

    ctx.strokeStyle = "#ff7d00";
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    for (let i = 0; i < drawableWidth; i++) {
      const angle = (i / drawableWidth) * (2 * Math.PI);
      const y = func(angle) * amplitude;
      const xPos = i + this.paddingSides;
      const yPos = centerY + y;
      if (i === 0) ctx.moveTo(xPos, yPos);
      ctx.lineTo(xPos, yPos);
    }
    ctx.stroke();
  }

  private drawSample(
    ctx: CanvasRenderingContext2D,
    data: Float32Array,
    start: number = 0,
    end: number = data.length,
    zoomY: number = 3
  ) {
    end = Math.min(end, data.length);
    start = Math.max(0, start);

    const { width, height } = this.viewDimensions;

    const drawableWidth = Math.max(1, width - this.paddingSides * 2);

    const duration = Math.max(end - start, drawableWidth);

    const intervalle = Math.floor(duration / this.viewDimensions.width);

    const centerY = height / 2;
    const amplitude = ((height - this.paddingTopBottom * 2) / 2) * zoomY;

    ctx.strokeStyle = "#ff7d00";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < drawableWidth; i++) {
      const y = data[i * intervalle + start] * amplitude;

      const xPos = i + this.paddingSides;
      const yPos = centerY + y;

      if (i === 0) ctx.moveTo(xPos, yPos);
      ctx.lineTo(xPos, yPos);
    }

    ctx.stroke();
    console.log("done");
  }

  private async createSelectableWaves() {
    const frag = document.createDocumentFragment();

    const waveKeys = Object.keys(waveFormFunctions) as Waveform[];
    const thumbWidth = Math.floor(this.viewDimensions.width / 4);
    const thumbHeight = Math.floor(this.viewDimensions.height / 4);

    for (const wave of waveKeys) {
      const thumbCanvas = document.createElement("canvas");
      thumbCanvas.className = "osc-little-canvas";

      thumbCanvas.width = Math.floor(thumbWidth * this.dpr);
      thumbCanvas.height = Math.floor(thumbHeight * this.dpr);
      const tctx = thumbCanvas.getContext("2d");
      if (!tctx) continue;

      tctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

      this.drawWave(tctx, wave, thumbWidth, thumbHeight, 1);

      try {
        if ((window as any).createImageBitmap) {
          const bmp = await (window as any).createImageBitmap(thumbCanvas);
          this.thumbnails.set(wave, bmp);
        } else {
          this.thumbnails.set(wave, thumbCanvas);
        }
      } catch {
        this.thumbnails.set(wave, thumbCanvas);
      }

      thumbCanvas.dataset.wave = String(wave);
      frag.appendChild(thumbCanvas);
    }

    this.rightColumn.appendChild(frag);
  }

  private onRightColumnClick(e: MouseEvent) {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    let el: HTMLElement | null = target;
    while (el && el !== this.rightColumn) {
      if (el instanceof HTMLCanvasElement && el.dataset.wave) {
        e.stopPropagation();
        const wave = el.dataset.wave as Waveform;
        this.setWaveform(wave);
        return;
      }
      el = el.parentElement;
    }
  }

  private setWaveform(wave: Waveform) {
    this.oscillator.waveform = wave;
    this.oscillator.type = "waveform";
    this.oscillator.sample = undefined;

    this.scheduleDraw();
  }

  public dispose() {
    this.fileDraggedInput.removeEventListener("change", this.bound.onFileChange);
    this.rightColumn.removeEventListener("click", this.bound.onRightColumnClick);
    this.importBtn.removeEventListener("click", this.bound.onClickInput);

    for (const val of this.thumbnails.values()) {
      if ((val as ImageBitmap).close) {
        try {
          (val as ImageBitmap).close();
        } catch {}
      }
    }
    this.thumbnails.clear();
  }
}
