import { ChordNames } from "../../shared/modules/chordNames";

export const moduleRegistry: Record<string, new (bounds: any) => any> = {
  ChordNames, // équivaut à "ChordNames: ChordNames"
};
