export abstract class Event {

    constructor() {
    }
    abstract key(): string;

}

export interface EventClass {
    new (): Event;

    key(): string;
}