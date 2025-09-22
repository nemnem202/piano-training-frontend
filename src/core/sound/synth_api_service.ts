import type { noteDTO } from "../../common/types/app-config";
import type { ExerciceStore } from "../state_management/exercice_state_store";
import { AudioEngineOrchestrator } from "./audio_engine_orchestrator";

export class SynthApi {
  private notes: noteDTO[] = [];
  private soundEngine: AudioEngineOrchestrator;
  constructor(store: ExerciceStore) {
    store.subscribe("notes", () => this.listenStore(store));
    this.soundEngine = AudioEngineOrchestrator.getInstance();
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

  static async playNote(note: noteDTO) {
    console.log(note);
  }

  static async stopNote(note: noteDTO) {
    console.log(note);
  }

  public destroy() {
    this.soundEngine.release();
  }
}
