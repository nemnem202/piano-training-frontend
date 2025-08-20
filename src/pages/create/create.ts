import { Page } from "../../core/abstract_classes/page";
import { Playlist } from "../../core/services/converters/ireal-decoder/decoder";
// UTILISEZ la chaîne originale et valide pour le test.
const workingRaw = "sdfgijspfgi";

export class Create extends Page {
  constructor() {
    super("", "import-container");
    this.init();
  }

  private init() {
    const playlist = new Playlist(workingRaw);
    if (playlist.songs.length <= 0) {
      console.error("invalid format !");
    }
  }
}
