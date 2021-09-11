

class EventDispatcher extends Phaser.Events.EventEmitter {

    static instance: EventDispatcher

    private constructor() {
        super();
    }

    static getInstance() {
        let instance;
        if (EventDispatcher.instance == null) {
            instance = new EventDispatcher();
        }
        return instance;
    }
}
