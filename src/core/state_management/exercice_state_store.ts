import { Store } from "../../common/abstracts/base_store";
import type { noteDTO } from "../../common/types/app-config";
import type { ExerciceStoreState } from "../../common/types/exercice";

export class ExerciceStore extends Store<ExerciceStoreState> {
  private noteValues = new Set<number>();

  constructor() {
    super(initialExerciceStoreState);
  }

  public addNote(note: noteDTO) {
    if (this.noteValues.has(note.value)) return; // déjà présent
    this.noteValues.add(note.value);

    const notes = this.getState("notes") as noteDTO[];
    notes.push(note);
    this.setState("notes", notes);
  }

  public removeNote(note: noteDTO) {
    if (!this.noteValues.has(note.value)) return;
    this.noteValues.delete(note.value);

    const notes = this.getState("notes") as noteDTO[];
    this.setState(
      "notes",
      notes.filter((n) => n.value !== note.value)
    );
  }
}
