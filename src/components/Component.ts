export abstract class Component {

    constructor() {
    }

    abstract key():string;
}

export interface ComponentClass {
    new(obj?): Component;
    key(): string
}
