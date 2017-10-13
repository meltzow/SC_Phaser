import {Event} from './Event'

export class EventBus {
    static listeners: { [eventName: string]: ((event: Event) => void)[] };

    static subscribe(cb: (event: Event) => void, event: Event) {
        var foundListener = this.listeners[event.name];
        if (!foundListener) {
            foundListener = new Array();
        }
        let idx = foundListener.indexOf(cb);
        if (idx < 0) {
            foundListener.push(cb);
        }
    }

    static unsubscribe(cb: (event: Event) => void, event: Event) {
        var foundListener = this.listeners[event.name];
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
            foundListener[idx](event);
        }
    }
}

