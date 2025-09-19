import { v4 } from "uuid";
import type { CellIreal, ChordIreal, PlaylistIreal, SongIreal } from "../../common/types/decoder";
import type {
  annotation,
  annotationType,
  Armature,
  Cell,
  Chord,
  Key,
  Measure,
  Playlist,
  Song,
} from "../../common/types/playlist";
import { available_notes } from "../../common/constants/available_notes";
import { PlaylistDAO } from "../data_acess/playlist_indexedDB_dao";
import { DEFAULT_EXERCICE_CONFIG } from "../../common/settings/defaultExercice";

export class IrealDataMapper {
  static convertPlaylist(playlist: PlaylistIreal): Playlist {
    const convertedSongs = this.convertSongArray(playlist.songs);
    return {
      Id: v4(),
      title: playlist.title,
      version: 1,
      creation: Date.now(),
      last_modif: Date.now(),
      public: false,
      difficulty: "medium",
      comments: [],
      songs: convertedSongs,
      Tags: ["Your playground"],
    };
  }

  static convertSongArray(songs: SongIreal[]): string[] {
    return songs.map((s) => this.convertSingleSong(s));
  }

  static convertSingleSong(song: SongIreal): string {
    const key = this.getSongKey(song.key);
    const measures = this.getSongMeasures(song.cells);
    const armature = this.getSongArmature(song.cells);
    const id = v4();
    const convertedSong: Song = {
      id: id,
      title: song.title,
      version: 1,
      author: song.composer,
      creation: Date.now(),
      last_modif: Date.now(),
      public: false,
      difficulty: "medium",
      tags: [],
      bpm: song.bpm,
      key: key,
      armature: armature,
      measures: measures,
      exercice_config: DEFAULT_EXERCICE_CONFIG,
    };

    this.send_song_to_db(convertedSong);

    return id;
  }

  static getSongKey(key: string): Key {
    const sortedNotes = [...available_notes].sort((a, b) => b.length - a.length);

    const rootNote = sortedNotes.find((note) => key.toUpperCase().startsWith(note.toUpperCase()));
    if (!rootNote) {
      throw new Error(`Aucune note trouvée dans la clé : ${key}`);
    }

    const root = available_notes.findIndex((n) => n.toUpperCase() === rootNote.toUpperCase());
    const harm = key.substring(rootNote.length);

    return { root, harm };
  }

  static getSongArmature(cells: CellIreal[]): Armature {
    const regex = /T[1-9]{2}/;

    for (const cell of cells) {
      for (const a of cell.annots) {
        const match = a.match(regex);
        if (match) {
          const numbers = match[0].split("T")[1].split("");
          const armature: Armature = [parseInt(numbers[0]), parseInt(numbers[1])];
          return armature;
        }
      }
    }

    return [4, 4];
  }

  static getSongMeasures(cells: CellIreal[]): Measure[] {
    const measuresArray: Measure[] = [];
    const currentMeasure: Measure = {
      empty: false,
      cells: [],
      notes: [],
    };

    for (let i = 0; i < cells.length; i++) {
      const cellIr = cells[i];

      const annotations: annotation[] = this.getSongAnnotations(cellIr);

      const chord = this.convertToChord(cellIr.chord);

      const cell: Cell = {
        annotations: annotations,
        chord: chord,
        comments: cellIr.comments,
        spacer: cellIr.spacer,
        bars: cellIr.bars,
      };
      currentMeasure.cells.push(cell);
      if (
        cellIr.bars.includes("}") ||
        cellIr.bars.includes(")") ||
        cellIr.bars.includes("]") ||
        i + 1 === cells.length
      ) {
        currentMeasure.empty = this.testIdMeasureEmpty(currentMeasure);
        measuresArray.push(JSON.parse(JSON.stringify(currentMeasure)));

        currentMeasure.cells = [];
      }
    }

    return measuresArray;
  }

  static testIdMeasureEmpty(m: Measure): boolean {
    return m.cells.find((c) => c.chord !== null) ? false : true;
  }

  static getSongAnnotations(cell: CellIreal): annotation[] {
    const annotations: annotation[] = cell.annots.map((a) => {
      return this.convertSongAnnot(a);
    });
    return annotations;
  }

  static convertSongAnnot(annot: string): annotation {
    const armatureRegex = /T[1-9]{2}/;
    const flagRegex = /\*[ABCDivabcd]/;
    let type: annotationType;
    if (armatureRegex.test(annot)) {
      type = "TimeChange";
    } else if (flagRegex.test(annot)) {
      type = "Part";
    } else if (annot.toLowerCase().includes("l")) {
      type = "RepeatStart";
    } else {
      type = "unknown";
    }

    return { content: annot, type: type };
  }

  static convertToChord(chord: ChordIreal | null): Chord | null {
    if (chord === null) return null;

    return {
      root: chord.note,
      type: chord.modifiers,
      alternate: this.convertToChord(chord.alternate),
      over: this.convertToChord(chord.over),
    };
  }

  static async send_song_to_db(song: Song): Promise<void> {
    await PlaylistDAO.create_song(song);
  }
}
