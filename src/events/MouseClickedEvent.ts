export enum ClickType {
    single,
    double

}

export default class MouseClickedEvent {
    constructor(public button: number, public x: number, public y: number, public clickType?: ClickType = ClickType.single) {

    }

}

export enum MouseButtons {
    left,
    right,
    middle
}


