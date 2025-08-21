import type { noteDTO } from "../../types/config";
import type { ExerciceStore } from "../stores/exerciceStore";

export class SynthApi {
  private notes: noteDTO[] = [];
  constructor(store: ExerciceStore) {
    store.subscribe("notes", () => this.listenStore(store));
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

  static playNote(note: noteDTO) {
    console.log("play note: ", note);
  }
  static stopNote(note: noteDTO) {
    console.log("stop note", note);
  }
}
