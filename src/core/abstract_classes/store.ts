export class Store<T extends Object> {
  private state: T;
  private listeners: { [K in keyof T]?: Set<() => void> } = {};
  private pendingKeys = new Set<keyof T>();

  constructor(initialState: T) {
    this.state = { ...initialState };
  }

  public getState = (key: keyof T) => this.state[key];

  public setState<K extends keyof T>(key: K, value: T[K]) {
    this.state[key] = value;
    this.pendingKeys.add(key);
    queueMicrotask(this.notify);
  }

  private notify = () => {
    this.pendingKeys.forEach((key) => this.listeners[key]?.forEach((l) => l()));
    this.pendingKeys.clear();
  };

  public subscribe<K extends keyof T>(key: K, callback: () => void): () => void {
    if (!this.listeners[key]) this.listeners[key] = new Set();
    this.listeners[key]!.add(callback);

    return () => this.listeners[key]?.delete(callback);
  }
}
