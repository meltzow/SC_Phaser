export default class MouseClickedEvent {
    constructor(public button: number, public x: number, public y: number) {

    }

}

export enum MouseButtons {
    left,
    right,
    middle

}
