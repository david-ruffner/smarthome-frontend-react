const listeners = new Set();

export function notify(message, options = {}) {
    const payload = {
        message
    }
    // TODO: Maybe do something with 'options'

    for (const fn of listeners) fn(payload);
}

export function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}