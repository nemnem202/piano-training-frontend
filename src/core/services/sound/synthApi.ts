import { defaultSynthConfig } from "../../settings/synth.js";
import type { noteDTO } from "../../types/config";
import type { ExerciceStore } from "../stores/exerciceStore";
import { SoundEngine } from "./soundEngine.js";
import createModule from "./wasm/build/synth.js";

export class SynthApi {
  private notes: noteDTO[] = [];
  static module: any;
  private soundEngine: SoundEngine;
  constructor(store: ExerciceStore) {
    store.subscribe("notes", () => this.listenStore(store));
    this.soundEngine = SoundEngine.getInstance();
    this.initSoundModule();
  }

  private async initSoundModule() {
    SynthApi.module = await createModule();
    SynthApi.module.initSynth(defaultSynthConfig);
    this.soundEngine.init(SynthApi.module);
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
    this.module.playNote(note.value);
  }

  static stopNote(note: noteDTO) {
    this.module.stopNote(note.value);
  }
}
