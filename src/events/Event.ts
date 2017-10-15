export abstract class Event {

    constructor() {
    }

    get name():string {
        return this.constructor.name;
    }
}