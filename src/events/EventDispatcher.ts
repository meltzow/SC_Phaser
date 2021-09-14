

export class EventDispatcher extends Phaser.Events.EventEmitter {

    static instance: EventDispatcher = new EventDispatcher()

    private constructor() {
        super();
    }

    static getInstance() {
        return EventDispatcher.instance;
    }
}
