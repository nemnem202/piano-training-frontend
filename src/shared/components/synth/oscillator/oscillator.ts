import { Component } from "../../../../core/abstract_classes/component";
import { audioFileToFloat32Array } from "../../../../core/services/converters/sound-file-decoder/soundFileDecoder";
import { waveFormFunctions } from "../../../../core/settings/synth";
import type { Dimensions } from "../../../../core/types/modules";
import type { Oscillator, Waveform } from "../../../../core/types/synth";
import "./oscillator.css";

export class OscillatorComponent extends Component {
  private fileDraggedInput = document.createElement("input");
  private inputZone = document.createElement("div");
  private canvas = document.createElement("canvas");
  private leftColumn = document.createElement("div");
  private rightColumn = document.createElement("div");

  private oscillator: Oscillator;
  private viewDimensions: Dimensions = { width: 200, height: 150 };
  private paddingSides = 5;
  private paddingTopBottom = 10;

  // caches et état
  private dpr = Math.max(1, window.devicePixelRatio || 1);
  private ctx: CanvasRenderingContext2D | null = null;
  private thumbnails = new Map<Waveform, ImageBitmap | HTMLCanvasElement>();
  private drawRequested = false;

  private zoomY = 1;
  private start = 0;
  private end = 0;

  // listeners stockés pour pouvoir les removeEventListener dans dispose()
  private bound = {
    onClickInput: (e: MouseEvent) => this.onClick(e),
    onDragEnter: (e: DragEvent) => this.onDragEnter(e),
    onDragOver: (e: DragEvent) => this.onDragOver(e),
    onDragLeave: (e: DragEvent) => this.onDragLeave(e),
    onDrop: (e: DragEvent) => this.onDrop(e),
    onFileChange: () => this.onFileDraggedInputChange(),
    onRightColumnClick: (e: MouseEvent) => this.onRightColumnClick(e),
  };

  constructor(oscillator: Oscillator) {
    super("div", "");
    this.oscillator = oscillator;

    // layout container
    this.content.style.display = "flex";
    this.content.style.flexDirection = "column";
    this.content.style.height = "100%";
    this.content.style.gap = "10px";
    this.content.style.alignItems = "center";

    // left column
    this.leftColumn.className = "lefColumn";
    this.leftColumn.style.position = "relative";
    this.leftColumn.style.flex = "1";

    // right column
    this.rightColumn.className = "rightColumn";
    this.rightColumn.style.display = "flex";
    this.rightColumn.style.gap = "3px";
    this.rightColumn.style.height = "30%";
    this.rightColumn.style.alignItems = "center";

    this.content.appendChild(this.leftColumn);
    this.content.appendChild(this.rightColumn);

    this.initInput();
    this.listenInput();
    this.initCanvas();
    this.listenCanvas();
    this.createSelectableWaves(); // pré-génère thumbnails
    this.scheduleDraw(); // premier dessin
  }

  // ---------- INPUT ----------

  private initInput() {
    this.inputZone.className = "osc-input-zone";
    // styles minimaux : préférer CSS, mais on garde l'essentiel inline pour compatibilité
    Object.assign(this.inputZone.style, {
      height: "100%",
      aspectRatio: "3/1",
      backgroundColor: "transparent",
      position: "absolute",
      transform: "translateX(-50%)",
      top: "0px",
      left: "0px",
      zIndex: "15",
      opacity: "0.5",
    });

    this.fileDraggedInput.type = "file";
    this.fileDraggedInput.accept = ".wav, .mp3";
    this.fileDraggedInput.style.display = "none";

    this.leftColumn.appendChild(this.inputZone);
    this.leftColumn.appendChild(this.fileDraggedInput);
  }

  private listenInput() {
    this.inputZone.addEventListener("click", this.bound.onClickInput);
    this.inputZone.addEventListener("dragenter", this.bound.onDragEnter);
    this.inputZone.addEventListener("dragover", this.bound.onDragOver, { passive: false });
    this.inputZone.addEventListener("dragleave", this.bound.onDragLeave);
    this.inputZone.addEventListener("drop", this.bound.onDrop);
    this.inputZone.addEventListener(
      "wheel",
      (e: WheelEvent) => {
        e.preventDefault();
        this.canvas.dispatchEvent(
          new WheelEvent("wheel", {
            deltaX: e.deltaX,
            deltaY: e.deltaY,
            deltaMode: e.deltaMode,
            bubbles: true,
            cancelable: true,
          })
        );
      },
      { passive: false }
    );
    this.fileDraggedInput.addEventListener("change", this.bound.onFileChange);
    // délégation pour miniatures
    this.rightColumn.addEventListener("click", this.bound.onRightColumnClick);
  }

  private onClick(e: MouseEvent) {
    e.stopPropagation();
    this.fileDraggedInput.click();
  }

  private onDragEnter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.inputZone.classList.add("dragover");
  }

  private onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    // passive:false above ensures preventDefault works
  }

  private onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.inputZone.classList.remove("dragover");
  }

  private onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.inputZone.classList.remove("dragover");
    const file = e.dataTransfer?.files?.[0];
    if (file) this.getFile(file);
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

  // ---------- CANVAS ----------

  private initCanvas() {
    // positionne le canvas principal (leftColumn)
    this.leftColumn.appendChild(this.canvas);

    // CSS logical sizes (pour layout)
    const { width, height } = this.viewDimensions;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.canvas.style.backgroundColor = "#111";
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0px";
    this.canvas.style.left = "0px";
    this.canvas.style.transform = "translateX(-50%)";
    this.canvas.style.aspectRatio = "3/1";
    this.canvas.style.height = "100%";

    // set réel pixel buffer en fonction du DPR
    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);

    // scale context to DPR so drawing uses logical coordinates
    this.ctx = this.canvas.getContext("2d");
    if (this.ctx) {
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
  }

  // schedule draw via requestAnimationFrame (debounced)
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

    // clear in logical coordinates
    const { width, height } = this.viewDimensions;
    this.ctx.clearRect(0, 0, width, height);

    // styles généraux
    this.ctx.save();
    this.ctx.strokeStyle = "#444";
    this.ctx.lineWidth = 1;

    // si sampler, on pourrait dessiner l'enveloppe du sample.
    if (this.oscillator.type === "waveform" && this.oscillator.waveform) {
      // draw waveform on main canvas (lineWidth 2)
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

  // dessine une forme dans le contexte fourni (attend que ctx soit déjà transformé pour DPR)
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

    ctx.strokeStyle = "#0f0";
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

  // dessine en fonction du sample

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

    ctx.strokeStyle = "#0f0";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < drawableWidth; i++) {
      const y = data[i * intervalle + start] * amplitude;

      const xPos = i + this.paddingSides;
      const yPos = centerY + y;
      // console.log(xPos, yPos);
      if (i === 0) ctx.moveTo(xPos, yPos);
      ctx.lineTo(xPos, yPos);
    }

    ctx.stroke();
    console.log("done");
  }

  // ---------- MINIATURES / SELECTABLE WAVES ----------

  private async createSelectableWaves() {
    // create elements via fragment for perf
    const frag = document.createDocumentFragment();

    const waveKeys = Object.keys(waveFormFunctions) as Waveform[];
    const thumbWidth = Math.floor(this.viewDimensions.width / 2); // logique
    const thumbHeight = Math.floor(this.viewDimensions.height / 2);

    // create thumbnails sequentially (could be parallelized if besoin)
    for (const wave of waveKeys) {
      const thumbCanvas = document.createElement("canvas");
      // logical CSS size
      // thumbCanvas.style.width = `${thumbWidth}px`;
      // thumbCanvas.style.height = `${thumbHeight}px`;
      thumbCanvas.style.backgroundColor = "#111";
      thumbCanvas.style.aspectRatio = "2/1";
      thumbCanvas.style.height = "100%";

      // real pixel buffer for crispness
      thumbCanvas.width = Math.floor(thumbWidth * this.dpr);
      thumbCanvas.height = Math.floor(thumbHeight * this.dpr);
      const tctx = thumbCanvas.getContext("2d");
      if (!tctx) continue;

      // scale for DPR
      tctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

      // draw waveform bigger line to be visible
      this.drawWave(tctx, wave, thumbWidth, thumbHeight, 2);

      // store a bitmap if available (faster draws later)
      try {
        // createImageBitmap expects a BlobSource; canvas is acceptable
        // We try to create a bitmap to keep it fast on draw.
        // Not all environments support createImageBitmap(canvas), so fallback to canvas element itself.
        // Note: createImageBitmap is async, we can await and cache the result.
        // We store either an ImageBitmap or the canvas element.
        if ((window as any).createImageBitmap) {
          const bmp = await (window as any).createImageBitmap(thumbCanvas);
          this.thumbnails.set(wave, bmp);
        } else {
          this.thumbnails.set(wave, thumbCanvas);
        }
      } catch {
        this.thumbnails.set(wave, thumbCanvas);
      }

      // attach dataset for delegation
      thumbCanvas.dataset.wave = String(wave);
      frag.appendChild(thumbCanvas);
    }

    this.rightColumn.appendChild(frag);
  }

  // délégation pour cliquer sur les miniatures
  private onRightColumnClick(e: MouseEvent) {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    // remonte jusqu'au canvas avec dataset.wave
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
    // redraw main canvas (will use drawWave)
    this.scheduleDraw();
  }

  // ---------- UTIL / CLEANUP ----------

  // call this when you remove the component to free resources
  public dispose() {
    // remove listeners
    this.inputZone.removeEventListener("click", this.bound.onClickInput);
    this.inputZone.removeEventListener("dragenter", this.bound.onDragEnter);
    this.inputZone.removeEventListener("dragover", this.bound.onDragOver);
    this.inputZone.removeEventListener("dragleave", this.bound.onDragLeave);
    this.inputZone.removeEventListener("drop", this.bound.onDrop);
    this.fileDraggedInput.removeEventListener("change", this.bound.onFileChange);
    this.rightColumn.removeEventListener("click", this.bound.onRightColumnClick);

    // revoke image bitmaps if possible
    for (const val of this.thumbnails.values()) {
      // ImageBitmap has close() in modern browsers
      if ((val as ImageBitmap).close) {
        try {
          (val as ImageBitmap).close();
        } catch {
          // ignore
        }
      }
    }
    this.thumbnails.clear();
  }
}
