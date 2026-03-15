// Simple event emitter for cross-component communication
class EventEmitter {
  private listeners: {[key: string]: Function[]} = {}

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    
    this.listeners[event].push(callback)

    // Return unsubscribe function
    return () => {
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter(fn => fn !== callback)
      }
    }
  }

  emit(event: string, ...args: any[]) {
    if (this.listeners[event] && this.listeners[event].length > 0) {
      // Call callbacks synchronously and safely
      this.listeners[event].forEach(callback => {
        try {
          callback(...args)
        } catch (err) {
          console.error(`Error in event listener for '${event}':`, err)
        }
      })
    }
  }

  removeAllListeners(event?: string) {
    if (event) {
      delete this.listeners[event]
    } else {
      this.listeners = {}
    }
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(fn => fn !== callback)
    }
  }
}

// Global event emitter instance
export const appEmitter = new EventEmitter()
