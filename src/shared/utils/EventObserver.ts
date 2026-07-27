export class EventObserver {
  private observers = new Map<string, Array<(data: any) => void>>()

  subscribe(id: string, fn: (data: any) => void) {
    const existing = this.observers.get(id) || []
    this.observers.set(id, [...existing, fn])
  }

  add(id: string) {
    this.observers.set(id, [])
  }

  pending(id: string): boolean {
    return this.observers.has(id)
  }

  broadcast(id: string, data?: any) {
    this.observers.get(id)?.forEach((fn) => fn(data))
    this.observers.delete(id)
  }
}
