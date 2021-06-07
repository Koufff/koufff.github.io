export class Observer {
  constructor() {
    this._subscribers = {};
  }

  on(event, subscriber) {
    if (!this._subscribers[event]) {
      this._subscribers[event] = [];
    }
    
    this._subscribers[event].push(subscriber);

    return {
      unsubscribe: () => this._unsubscribe(subscriber),
    }
  }

  _unsubscribe(subscriber) {
    this._subscribers = this._subscribers.filter((s) => s === subscriber);
  }

  _notify(event, data) {
    this._subscribers[event].forEach((s) => s(data))
  }
}
