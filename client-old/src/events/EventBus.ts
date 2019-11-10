import {Event, EventClass} from './Event'

export class EventBus {
    static listeners: { [eventName: string]: ((event: Event) => void)[] } = {};

    static subscribe<T extends Event>(eventClass: EventClass, cb: (event: Event) => void) {
        var foundListener = EventBus.listeners[eventClass.key()];
        if (!foundListener) {
            foundListener = new Array();
            EventBus.listeners[eventClass.key()] = foundListener;
        }
        let idx = foundListener.indexOf(cb);
        if (idx < 0) {
            foundListener.push(cb);
        }
    }

    static unsubscribe(eventClass: EventClass, cb: (event: Event) => void) {
        var foundListener = EventBus.listeners[eventClass.key()];
        if (!foundListener) {
            return;
        }
        let idx = foundListener.indexOf(cb);
        foundListener.splice(idx, 1);
    }

    static post(event: Event) {
        var foundListener = EventBus.listeners[event.constructor.name];
        if (!foundListener) {
            return;
        }
        console.log("posting " + event.constructor.name + " found " + foundListener.length + " listener")
        for (var idx in foundListener) {
            foundListener[idx](event);
        }
    }
}

