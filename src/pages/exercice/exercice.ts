import type { Module } from "../../core/abstract_classes/module";
import { Page } from "../../core/abstract_classes/page";
import { PlaylistDAO } from "../../core/services/data/playlistDAO";
import { moduleRegistry, type SongDTO } from "../../core/types/data";
import type { Corner, Dimensions, Edge, ResizeHandle } from "../../core/types/modules_types";
import exerciceTemplate from "./exercice.html?raw";
import "./exerice.css";

export class Exercice extends Page {
  private grid: HTMLCanvasElement | undefined;
  private ctx: CanvasRenderingContext2D | null = null;
  private song: SongDTO | undefined;
  public gridCellSize = 50;
  public readonly magnetism: boolean | undefined;
  public appDimensions: Dimensions = { width: 0, height: 0 };
  public modules: Map<number, Module> = new Map();
  private topZIndex = 0;
  public draggedModule: Module | null = null;
  public resizedModule: { module: Module; edge: Edge | Corner }[] = [];

  constructor(params: Record<string, string>) {
    super(exerciceTemplate, "exercice-container", params);
    this.content.style.height = "100vh";
    this.grid = document.createElement("canvas");
    this.ctx = this.grid.getContext("2d");
    this.content.appendChild(this.grid);

    // this.content.style.pointerEvents = "none";
    this.content.style.userSelect = "none";
    this.content.style.webkitUserSelect = "none";
    this.content.setAttribute("draggable", "false");

    requestAnimationFrame(() => this.init());
  }

  /** Initialise les dimensions et le rendu du canvas */
  private async init() {
    if (!this.params || !this.params.title || !this.params.songTitle) return;

    const playlist = await PlaylistDAO.get(this.params.title);

    if (!playlist) return;
    this.song = playlist.songs.find((s) => s.title === this.params?.songTitle);
    if (!this.song) return;

    this.updateDimensions();
    this.drawGrid();
    this.initStore();
    this.addModules();

    window.addEventListener("resize", () => {
      this.clearCanvas();
      this.updateDimensions();
      this.drawGrid();
    });

    this.listenMouseEvents();
  }

  private initStore() {}

  private addModules() {
    if (!this.song) return;
    console.log(this.song);
    this.song.exercice.modules.forEach((m) => {
      const ModuleClass = moduleRegistry[m.type];
      const module = new ModuleClass(m.params.square);
      module.attachContainer(this);
      this.modules.set(this.modules.size, module);
    });
  }

  public removeModule(module: Module) {
    for (const [id, mod] of this.modules) {
      if (mod === module) {
        this.modules.delete(id);
        continue;
      }
      module.content.style.zIndex = String(parseInt(module.content.style.zIndex) - 1);
    }
    module.content.remove();
  }

  private adaptModules(ratioX: number, ratioY: number) {
    for (const [, module] of this.modules) {
      const sq = module.square;
      module.setPosition(sq.x * ratioX, sq.y * ratioY);
      module.resize(sq.width * ratioX, sq.height * ratioY);
    }
  }

  /** Met à jour les dimensions du canvas selon le container */
  private updateDimensions(): void {
    if (!this.grid) return;
    const rect = this.content.getBoundingClientRect();

    this.adaptModules(
      rect.width / this.appDimensions.width,
      rect.height / this.appDimensions.height
    );
    this.appDimensions = { width: rect.width, height: rect.height };
    this.grid.width = this.appDimensions.width;
    this.grid.height = this.appDimensions.height;
  }

  /** Dessine la grille principale et secondaire */
  private drawGrid(): void {
    if (!this.ctx) return;

    this.clearCanvas();
    this.ctx.strokeStyle = "#fff";

    // Grille principale (10 divisions)
    this.drawGridLines(10, 0.3);
    this.drawGridLines(this.gridCellSize, 0.15);
  }

  /** Efface le contenu du canvas */
  private clearCanvas(): void {
    if (!this.grid) return;
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.grid.width, this.grid.height);
    }
  }

  private drawGridLines(divisions: number, lineWidth: number): void {
    if (!this.grid) return;
    if (!this.ctx) return;

    const { width, height } = this.grid;
    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth;

    for (let i = 1; i < divisions; i++) {
      const y = (i * height) / divisions;
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);

      const x = (i * width) / divisions;
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
    }

    this.ctx.stroke();
  }

  private listenMouseEvents() {
    this.content.addEventListener("mouseup", () => {
      this.handleMouseUp();
    });

    this.content.addEventListener("mousedown", (e) => {
      this.handleMouseDown(e);
    });

    this.content.addEventListener("mousemove", (e) => {
      this.handleMouseMove(e);
    });
  }

  private handleMouseUp() {
    this.changeDraggedModule(null);
    this.resizedModule = [];
  }

  private handleMouseDown(e: MouseEvent) {
    for (const [, module] of this.modules) {
      const resizeZone = module.getResizeHandleAtPoint(e.clientX, e.clientY);
      if (resizeZone) {
        this.resizedModule.push({ module: module, edge: resizeZone });
      }
    }
  }

  private handleMouseMove(e: MouseEvent) {
    if (this.draggedModule) {
      this.processModuleMove(e);
    } else if (this.resizedModule.length > 0) {
      this.processModuleResize(e);
    } else {
      this.updateCursorForHover(e);
    }
  }

  private processModuleMove(e: MouseEvent) {
    this.draggedModule!.setPosition(
      e.clientX - this.draggedModule!.offset.x,
      e.clientY - this.draggedModule!.offset.y
    );
  }

  private processModuleResize(e: MouseEvent) {
    this.resizedModule.forEach((rm) => rm.module.handleResize(e.clientX, e.clientY, rm.edge));
  }

  private updateCursorForHover(e: MouseEvent) {
    let newCursor: string = "default"; // Utilisez un type string directement

    for (const [, module] of this.modules) {
      const resizeHandle = module.getResizeHandleAtPoint(e.clientX, e.clientY); // Utilise le nouveau nom
      if (resizeHandle) {
        newCursor = this.getCursorForHandle(resizeHandle);
        break; // On a trouvé un handle, pas besoin de chercher plus loin
      }

      if (module.isPointInMoveZone(e.clientX, e.clientY)) {
        newCursor = "move";
        break; // La zone de déplacement a été trouvée
      }
    }
    this.content.style.cursor = newCursor;
  }

  private getCursorForHandle(handle: ResizeHandle): string {
    switch (handle) {
      case "ne":
      case "sw":
        return "nesw-resize";
      case "nw":
      case "se":
        return "nwse-resize";
      case "left":
      case "right":
        return "ew-resize";
      case "top":
      case "bottom":
        return "ns-resize";
      default:
        return "default";
    }
  }

  public updateCursor(edge: Edge | Corner | "move" | "default") {
    switch (edge) {
      case "ne":
      case "sw":
        this.content.style.cursor = "nesw-resize";
        break;
      case "nw":
      case "se":
        this.content.style.cursor = "nwse-resize";
        break;
      case "left":
      case "right":
        this.content.style.cursor = "ew-resize";
        break;
      case "top":
      case "bottom":
        this.content.style.cursor = "ns-resize";
        break;
      case "move":
        this.content.style.cursor = "move";
        break;
      case "default":
        this.content.style.cursor = "default";
        break;
    }
  }

  public changeDraggedModule(module: Module | null) {
    if (module) {
      this.draggedModule = module;
      this.content.style.cursor = "move";
    } else {
      this.draggedModule = null;
      this.content.style.cursor = "default";
    }
  }

  public bringModuleToFront(module: Module) {
    this.topZIndex++;
    module.content.style.zIndex = String(this.topZIndex);
  }
}
