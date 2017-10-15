import {Event} from './Event'

export class EventBus {
    static listeners: { [eventName: string]: ((event: Event) => void)[] };

    static subscribe(eventClass: {new (): Event}, cb: (event: Event) => void) {
        var foundListener = this.listeners[eventClass.name];
        if (!foundListener) {
            foundListener = new Array();
        }
        let idx = foundListener.indexOf(cb);
        if (idx < 0) {
            foundListener.push(cb);
        }
    }

    static unsubscribe(eventClass: {new (): Event}, cb: (event: Event) => void) {
        var foundListener = this.listeners[eventClass.name];
        if (!foundListener) {
            return;
        }
        let idx = foundListener.indexOf(cb);
        foundListener.splice(idx, 1);
    }

    static post(event: Event) {
        var foundListener = this.listeners[event.name];
        if (!foundListener) {
            return;
        }
        for (var idx in foundListener) {
            setTimeout(foundListener[idx](event));
        }
    }
}

