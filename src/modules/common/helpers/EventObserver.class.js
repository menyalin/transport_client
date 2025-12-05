export class EventObserver {
  constructor() {
    this.observers = new Map()
  }
  subscribe(id, fn) {
    this.observers.set(id, [...this.observers.get(id), fn])
  }

  add(id) {
    this.observers.set(id, [])
  }

  pending(id) {
    return this.observers.has(id)
  }

  broadcast(id, data) {
    this.observers.get(id)?.forEach(fn => fn(data))
    this.observers.delete(id)
  }
}
