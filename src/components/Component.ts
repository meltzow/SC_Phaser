export abstract class Component {

    constructor(obj?:any) {
    }

    abstract key():string;

    toString() {
        return this.key();
    }
}

export interface ComponentClass {
    new(obj?): Component;
    key(): string
}
