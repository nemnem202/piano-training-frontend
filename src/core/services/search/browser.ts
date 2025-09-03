export class Browser {
  static browse<T extends Record<string, unknown>>(text: string, key: keyof T, array: T[]): T[] {
    const searchWords = this.tokenize(text);

    // Calcule un score de pertinence pour un item :
    // score = max( min(len(searchWord), len(valueWord)) ) pour tous les couples qui matchent
    const scoreForItem = (value: string): number => {
      const valueWords = this.tokenize(value);
      let best = 0;

      for (const s of searchWords) {
        for (const v of valueWords) {
          if (this.wordsMatch(s, v)) {
            const candidate = Math.min(s.length, v.length);
            if (candidate > best) best = candidate;
          }
        }
      }

      return best;
    };

    // Filtre les items qui matchent (score > 0) et associe leur score
    const scored = array
      .map((item) => {
        const val = item[key];
        if (typeof val !== "string") return null;
        const score = scoreForItem(val);
        if (score === 0) return null;
        return { item, score };
      })
      .filter(Boolean) as { item: T; score: number }[];

    // Trie décroissant par score et renvoie les items
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8).map((s) => s.item);
  }

  // Normalise & découpe en mots (évite mots vides)
  private static tokenize(s: string): string[] {
    return s
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase());
  }

  // Matching basique (insensible à la casse grâce au tokenize)
  private static wordsMatch(a: string, b: string): boolean {
    return a.includes(b) || b.includes(a);
  }
}
