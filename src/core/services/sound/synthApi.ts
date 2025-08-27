import type { noteDTO } from "../../types/config";
import type { ExerciceStore } from "../stores/exerciceStore";
import init, { play_note, stop_note } from "./rust-synth/build/rust_synth.js";
import { SoundEngine } from "./soundEngine.js";

const initRustSynth = init;

export class SynthApi {
  private notes: noteDTO[] = [];
  private soundEngine: SoundEngine;
  constructor(store: ExerciceStore) {
    store.subscribe("notes", () => this.listenStore(store));
    this.soundEngine = SoundEngine.getInstance();
    this.soundEngine.init();
    initRustSynth();
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
    if (!note.velocity) note.velocity = 50;

    console.log(play_note(note.value, note.velocity));
  }

  static stopNote(note: noteDTO) {
    stop_note(note.value);
  }
}
