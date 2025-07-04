export class LocalDB<T extends { id: string }> {
  constructor(private key: string) {}

  private read(): T[] {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(this.key);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }

  private write(data: T[]): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  list(): T[] {
    return this.read();
  }

  get(id: string): T | undefined {
    return this.read().find((item) => item.id === id);
  }

  add(item: T): void {
    const data = this.read();
    data.push(item);
    this.write(data);
  }

  update(id: string, partial: Partial<T>): void {
    const data = this.read().map((item) =>
      item.id === id ? { ...item, ...partial } : item,
    );
    this.write(data);
  }

  delete(id: string): void {
    const data = this.read().filter((item) => item.id !== id);
    this.write(data);
  }
} 