import type { noteDTO } from "../../types/config";
import type { ExerciceStore } from "../stores/exerciceStore";

import { SoundEngine } from "./soundEngine.js";

export class SynthApi {
  private notes: noteDTO[] = [];
  private soundEngine: SoundEngine;
  constructor(store: ExerciceStore) {
    store.subscribe("notes", () => this.listenStore(store));
    this.soundEngine = SoundEngine.getInstance();
    this.soundEngine.init();
  }

  private listenStore = (store: ExerciceStore) => {
    const storeNotes = store.getState("notes") as noteDTO[];

    const notesToPlay = storeNotes.filter((n) => !this.notes.includes(n));

    for (const n of notesToPlay) {
      SynthApi.playNote(n);
    }
    const notesToStop = this.notes.filter((n) => !storeNotes.includes(n));
    for (const n of notesToStop) {
      SynthApi.stopNote(n);
    }

    this.notes = [...storeNotes];
  };

  static async playNote(note: noteDTO) {}

  static async stopNote(note: noteDTO) {}

  public destroy() {
    this.soundEngine.release();
  }
}
