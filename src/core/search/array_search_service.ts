export class ArraySearchService {
  static browse<T extends Record<string, unknown>>(text: string, key: keyof T, array: T[]): T[] {
    return array
      .map((item) => ({ item, score: this.get_similarity(text, String(item[key])) }))
      .filter((r) => r.score > 0.4) // seuil de pertinence
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item)
      .splice(0, 20);
  }

  static get_similarity(a: string, b: string): number {
    a = a.toLowerCase();
    b = b.toLowerCase();
    const matches = a.split("").filter((c) => b.includes(c)).length;
    return matches / Math.max(a.length, b.length);
  }
}
