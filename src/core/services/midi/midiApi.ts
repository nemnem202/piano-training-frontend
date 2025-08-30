import type { ExerciceStore } from "../stores/exerciceStore";

export class MidiApi {
  store: ExerciceStore;
  midiAccess: MIDIAccess | null = null;

  constructor(store: ExerciceStore) {
    this.store = store;
    this.requestMidiAccess();
  }

  private async requestMidiAccess() {
    this.midiAccess = await navigator.requestMIDIAccess();
    if (this.midiAccess) {
      this.onMidiSuccess(this.midiAccess);
    } else {
      alert("Can't access to midi api!  :/");
    }
  }

  private onMidiSuccess(midiAccess: MIDIAccess) {
    const inputs = Array.from(midiAccess.inputs.values());

    console.log("Inputs:", inputs);

    inputs.forEach((input) => {
      input.onmidimessage = (ev) => this.handleMidiMessage(ev);
    });
  }

  private handleMidiMessage(ev: MIDIMessageEvent) {
    if (!ev.data) return;
    const status = ev.data[0];
    const note = ev.data[1];
    const velocity = ev.data[2];

    const isNoteOn = status === 153 && velocity > 0;

    if (isNoteOn) {
      this.store.addNote({ value: note, velocity });
    } else if (status === 137 || (status === 153 && velocity === 0)) {
      this.store.removeNote({ value: note });
    }
  }
}
