export abstract class Component {

    constructor() {
    }

    /*get name(): string {
        return this.constructor.name;
    }*/
}

export interface ComponentClass {
    new(obj?): Component;
}
