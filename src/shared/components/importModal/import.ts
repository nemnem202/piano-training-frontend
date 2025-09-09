import importTemplate from "./import.html?raw";
import { PlaylistDAO } from "../../../core/services/data/playlistDAO";
import type { Router } from "../../../app/router";
import { AppManager } from "../../../app/appManager";
import { PlaylistInterpreter } from "../../../core/services/converters/ireal-decoder/decoder";
import { IrealConverter } from "../../../core/services/converters/ireal-converter/irealConverter";
import { Spinner } from "../spinner/spinner";
import { Component } from "../../../core/abstract_classes/component";

export class ImportModal extends Component {
  modal: HTMLDivElement | null = null;
  fileDraggedInput: HTMLInputElement | null = null;
  urlInput: HTMLInputElement | null = null;
  router: Router | null = null;

  constructor() {
    super("div", importTemplate);
    document.body.appendChild(this.content);

    this.initializeElements();
    this.bindEvents();
  }

  // --- Initialisation des éléments ---
  private initializeElements() {
    this.modal = this.content.querySelector(".import-modal") as HTMLDivElement;

    if (!this.modal) return;
    this.router = AppManager.getInstance().router;

    this.fileDraggedInput = document.createElement("input");
    this.fileDraggedInput.type = "file";
    this.fileDraggedInput.accept = ".html";
    this.fileDraggedInput.style.display = "none";
    this.modal.appendChild(this.fileDraggedInput);

    this.urlInput = this.modal.querySelector("#urlInput") as HTMLInputElement;

    if (!this.urlInput) return;

    this.urlInput.addEventListener("click", (e) => e.stopPropagation());
    this.urlInput.addEventListener("change", () => {
      if (this.urlInput && this.urlInput.value) {
        this.readUrl(this.urlInput.value);
      }
    });

    // const link = document.querySelector(".browse-link");

    // if (!link) return;

    // link.addEventListener("click", (e) => {});
  }

  // --- Binding des événements ---
  private bindEvents() {
    if (!this.modal || !this.fileDraggedInput) return;

    this.modal.addEventListener("click", this.onModalClick);
    this.content.addEventListener("click", this.onContentClick);
    this.modal.addEventListener("dragenter", this.onDragEnter);
    this.modal.addEventListener("dragover", this.onDragOver);
    this.modal.addEventListener("dragleave", this.onDragLeave);
    this.modal.addEventListener("drop", this.onDrop);
    this.fileDraggedInput.addEventListener("change", this.onFileDraggedInputChange);
  }

  // --- Gestion des événements ---

  private onModalClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.fileDraggedInput?.click();
  };

  private onContentClick = () => {
    this.destroy();
  };

  private onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.modal?.classList.add("dragover");
  };

  private onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  private onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.modal?.classList.remove("dragover");
  };

  private onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.modal?.classList.remove("dragover");

    if (e.dataTransfer?.files?.length) {
      this.readHtmlFile(e.dataTransfer.files[0]);
    }
  };

  private onFileDraggedInputChange = () => {
    if (this.fileDraggedInput?.files?.length) {
      this.readHtmlFile(this.fileDraggedInput.files[0]);
    }
  };

  // private onLinkClick = (e:MouseEvent)=>{
  //   e.stopPropagation()

  // }

  // --- Lecture et extraction HTML ---
  private readHtmlFile(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        this.extractLinksFromHtml(reader.result);
      }
    };
    reader.readAsText(file);
  }

  private extractLinksFromHtml(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const links = Array.from(doc.querySelectorAll("a")).map((a) => a.href);
    const regex = /^irealb:\/\/.*/;
    const link = links.find((e) => regex.test(e));
    if (link) {
      this.readUrl(link);
    } else {
      console.error("fichier incompaptible");
    }
  }

  // --- Lecture d'une URL ---
  public readUrl(url: string) {
    const regex = /^irealb:\/\/.*/;
    if (regex.test(url)) {
      this.processPlaylistCreation(url);
      const spinner = new Spinner(50);
      if (!this.modal) return;
      this.modal.innerHTML = "<div></div>";
      this.modal.appendChild(spinner.content);
      this.modal.innerHTML += "<div></div>";
    } else {
      console.error("lien invalide");
    }
  }

  private async processPlaylistCreation(url: string) {
    const playlistInterpreter = new PlaylistInterpreter(url);
    const playlist = IrealConverter.convertPlaylist(playlistInterpreter);

    try {
      if (playlist.songs) {
        const id = await PlaylistDAO.create_playlist(playlist);
        if (id != null) {
          this.destroy();
          this.router!.redirect(`playlist/${id}`);
        } else {
          console.error("An error occurred while saving the data");
        }
      } else {
        console.error("File corrupted");
      }
    } catch (error: any) {
      console.error("Unexpected error:", error.message);
      switch (error.name) {
        case "ConstraintError":
          document.body.innerHTML = "the fileName already exists";
      }
    }
  }

  // --- Nettoyage ---
  public destroy() {
    if (this.modal) {
      this.modal.removeEventListener("click", this.onModalClick);
      this.modal.removeEventListener("dragenter", this.onDragEnter);
      this.modal.removeEventListener("dragover", this.onDragOver);
      this.modal.removeEventListener("dragleave", this.onDragLeave);
      this.modal.removeEventListener("drop", this.onDrop);
    }

    if (this.fileDraggedInput) {
      this.fileDraggedInput.removeEventListener("change", this.onFileDraggedInputChange);
    }

    this.content.removeEventListener("click", this.onContentClick);

    if (this.content.parentNode) {
      this.content.parentNode.removeChild(this.content);
    }
  }
}
