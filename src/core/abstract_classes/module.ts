import type { Exercice } from "../../pages/exercice/exercice";
import type { ExerciceStore } from "../services/stores/exerciceStore";
import type { Bounds, Corner, Edge, Position } from "../types/modules";
import { Component } from "./component";

const RESIZE_TOLERANCE = 10;
const CLOSE_BUTTON_WIDTH = 50;
const WINDOW_BAR_HEIGHT = 30;

export abstract class Module extends Component {
  public bounds: Bounds = { height: 0, width: 0, x: 0, y: 0 };
  protected store: ExerciceStore;
  public container: Exercice | undefined;
  public offset: Position = { x: 0, y: 0 };

  private moveStrategy: MoveStrategy = new FreeMoveStrategy();
  private resizeStrategy: ResizeStrategy = new FreeResizeStrategy();
  private windowBar: HTMLDivElement;

  constructor(bounds: Bounds, store: ExerciceStore) {
    super("div", "");
    this.store = store;
    this.bounds = bounds;
    this.windowBar = document.createElement("div");
  }

  public attachContainer(container: Exercice) {
    this.container = container;
    this.init();
  }

  private init() {
    this.updateMagnetismStrategies();
    this.initStyles();
    this.listenEvents();
    this.setPosition(this.bounds.x, this.bounds.y);
    this.resize(this.bounds.width, this.bounds.height);
    this.initWindowBar();
    this.handleWindowClick();
  }

  private initStyles() {
    if (!this.container) return;
    this.content.style.backgroundColor = "red";
    this.content.style.zIndex = String(this.container.modules.size);
    this.content.style.position = "absolute";
    this.content.style.top = `0px`;
    this.content.style.left = `0px`;
    this.container.content.appendChild(this.content);
  }

  private listenEvents() {
    this.content.addEventListener("mousemove", () => {
      if (!this.container) return;
      if (this.container.resizedModule.length === 0 && !this.container.draggedModule) {
        this.windowBar.style.display = "flex";
        this.windowBar.style.height = `${WINDOW_BAR_HEIGHT}px`;
      }
    });
    this.content.addEventListener("mouseleave", () => {
      if (!this.container) return;
      if (!(this.container.draggedModule === this)) {
        this.windowBar.style.height = `${0}px`;
        this.windowBar.style.display = "none";
      }
    });
  }

  private initWindowBar() {
    this.windowBar.style.position = "absolute";
    this.windowBar.style.top = "0";
    this.windowBar.style.width = "100%";
    this.windowBar.style.display = "flex";
    this.windowBar.style.height = `${0}px`;
    this.windowBar.style.display = "none";
    this.windowBar.style.zIndex = "20";

    const moveZone = this.createMoveZone();
    const closeButton = this.createCloseButton();

    this.windowBar.appendChild(moveZone);
    this.windowBar.appendChild(closeButton);
    this.content.appendChild(this.windowBar);
  }

  private createMoveZone(): HTMLDivElement {
    const moveZone = document.createElement("div");
    moveZone.style.backgroundColor = "white";
    moveZone.style.flex = "1";

    moveZone.addEventListener("mousedown", (e) => this.handleMoveZoneHit(e));
    return moveZone;
  }

  private createCloseButton(): HTMLDivElement {
    const closeButton = document.createElement("div");
    closeButton.textContent = "X";
    closeButton.style.backgroundColor = "grey";
    closeButton.style.width = `${CLOSE_BUTTON_WIDTH}px`;
    closeButton.style.display = "flex";
    closeButton.style.alignItems = "center";
    closeButton.style.justifyContent = "center";

    closeButton.addEventListener("click", (e) => this.handleCloseButtonHit(e));
    return closeButton;
  }

  setPosition(x: number, y: number) {
    if (!this.container) return;
    const maxX = this.container.appDimensions.width - this.bounds.width;
    const maxY = this.container.appDimensions.height - this.bounds.height;

    const clampedX = Math.max(0, Math.min(x, maxX));
    const clampedY = Math.max(0, Math.min(y, maxY));

    const { x: finalX, y: finalY } = this.moveStrategy.getPosition(clampedX, clampedY, this);
    this.bounds.x = finalX;
    this.bounds.y = finalY;
    this.content.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;
  }

  resize(width: number, height: number) {
    const { width: finalW, height: finalH } = this.resizeStrategy.getSize(width, height, this);
    this.bounds.width = finalW;
    this.bounds.height = finalH;
    this.content.style.width = `${finalW}px`;
    this.content.style.height = `${finalH}px`;
  }

  private handleMoveZoneHit(e: MouseEvent) {
    if (!this.container) return;
    e.stopPropagation();
    this.bringToFront();
    this.container.changeDraggedModule(this);
    this.offset = { x: e.clientX - this.bounds.x, y: e.clientY - this.bounds.y };
  }

  private handleCloseButtonHit(e: MouseEvent) {
    if (!this.container) return;
    e.stopPropagation();
    this.container.removeModule(this);
  }

  private handleWindowClick() {
    this.content.addEventListener("click", (e) => {
      e.stopPropagation();
      this.bringToFront();
    });
  }

  private bringToFront() {
    if (!this.container) return;
    this.container.bringModuleToFront(this);
  }

  public updateMagnetismStrategies() {
    if (!this.container) return;
    this.moveStrategy = this.container.magnetism
      ? new MagnetismMoveStrategy()
      : new FreeMoveStrategy();
    this.resizeStrategy = this.container.magnetism
      ? new MagnetismResizeStrategy()
      : new FreeResizeStrategy();
  }

  public isPointInMoveZone(x: number, y: number): boolean {
    const isInRangeX =
      x >= this.bounds.x && x <= this.bounds.width + this.bounds.x - CLOSE_BUTTON_WIDTH;
    const isInRangeY = y >= this.bounds.y && y <= this.bounds.y + WINDOW_BAR_HEIGHT;

    return isInRangeX && isInRangeY;
  }

  public getResizeHandleAtPoint(x: number, y: number): Edge | Corner | null {
    const topMin = this.bounds.y - RESIZE_TOLERANCE;
    const topMax = this.bounds.y;
    const bottomMax = this.bounds.y + this.bounds.height + RESIZE_TOLERANCE;
    const bottomMin = this.bounds.y + this.bounds.height;
    const leftMin = this.bounds.x - RESIZE_TOLERANCE;
    const leftMax = this.bounds.x;
    const rightMax = this.bounds.x + this.bounds.width + RESIZE_TOLERANCE;
    const rightMin = this.bounds.x + this.bounds.width;

    const topSide = y > topMin && y < topMax;
    const bottomSide = y > bottomMin && y < bottomMax;
    const leftSide = x > leftMin && x < leftMax;
    const rightSide = x > rightMin && x < rightMax;

    const cornerTopLeft = leftSide && topSide;
    const cornerTopRight = rightSide && topSide;
    const cornerBottomLeft = leftSide && bottomSide;
    const cornerBottomRight = rightSide && bottomSide;

    if (cornerTopLeft) return "nw";
    if (cornerTopRight) return "ne";
    if (cornerBottomLeft) return "sw";
    if (cornerBottomRight) return "se";
    if (topSide && x > leftMax && x < rightMin) return "top";
    if (bottomSide && x > leftMax && x < rightMin) return "bottom";
    if (leftSide && y > topMax && y < bottomMin) return "left";
    if (rightSide && y > topMax && y < bottomMin) return "right";
    return null;
  }

  public handleResize(x: number, y: number, resize: Corner | Edge) {
    this.bringToFront();
    switch (resize) {
      case "left":
      case "right":
        this.horizontalResize(x, resize);
        break;
      case "top":
      case "bottom":
        this.verticalResize(y, resize);
        break;
      case "nw":
        this.horizontalResize(x, "left");
        this.verticalResize(y, "top");
        break;
      case "ne":
        this.horizontalResize(x, "right");
        this.verticalResize(y, "top");
        break;
      case "sw":
        this.horizontalResize(x, "left");
        this.verticalResize(y, "bottom");
        break;
      case "se":
        this.horizontalResize(x, "right");
        this.verticalResize(y, "bottom");
        break;
    }
  }

  public horizontalResize(x: number, edge: Edge) {
    switch (edge) {
      case "left":
        this.resize(this.bounds.x + this.bounds.width - x, this.bounds.height);
        this.setPosition(x, this.bounds.y);
        break;
      case "right":
        this.resize(x - this.bounds.x, this.bounds.height);
        break;
    }
  }

  public verticalResize(y: number, edge: Edge) {
    switch (edge) {
      case "top":
        this.resize(this.bounds.width, this.bounds.y + this.bounds.height - y);
        this.setPosition(this.bounds.x, y);
        break;
      case "bottom":
        this.resize(this.bounds.width, y - this.bounds.y);
    }
  }
}

export interface MoveStrategy {
  getPosition(x: number, y: number, module: Module): { x: number; y: number };
}

export interface ResizeStrategy {
  getSize(width: number, height: number, module: Module): { width: number; height: number };
}

export class MagnetismMoveStrategy implements MoveStrategy {
  getPosition(x: number, y: number, module: Module) {
    if (!module.container) return { x: 0, y: 0 };
    const stepX = module.container.appDimensions.width / module.container.gridCellSize;
    const stepY = module.container.appDimensions.height / module.container.gridCellSize;

    return {
      x: Math.round(x / stepX) * stepX,
      y: Math.round(y / stepY) * stepY,
    };
  }
}

export class MagnetismResizeStrategy implements ResizeStrategy {
  getSize(width: number, height: number, module: Module) {
    if (!module.container) return { width: 0, height: 0 };
    const stepX = module.container.appDimensions.width / module.container.gridCellSize;
    const stepY = module.container.appDimensions.height / module.container.gridCellSize;

    return {
      width: Math.round(width / stepX) * stepX,
      height: Math.round(height / stepY) * stepY,
    };
  }
}

export class FreeMoveStrategy implements MoveStrategy {
  getPosition(x: number, y: number) {
    return { x, y };
  }
}

export class FreeResizeStrategy implements ResizeStrategy {
  getSize(width: number, height: number) {
    return { width, height };
  }
}
