import {Component} from "./Component";

export class Camera extends Component {
    maxSpeed: number;
    protected speed: number;
    protected acceleration: number;
    protected deceleration: number;
    x: number;
    y: number;
    protected moveSpeed: number = 3;
    nextMove: MOVE = MOVE.STOP;
    //protected nextPoint: Phaser.POINTPoint2D = null;

    constructor(opt?) {
        super();
        if (opt) {
            this.maxSpeed = opt.maxSpeed;
            this.speed = 0;
            this.acceleration = 0;
            this.deceleration = 0;
//        this.pos = Point3D.UNIT;
//        this.target = Point3D.ORIGIN;
        }
    }


}

export enum MOVE {
    STOP, ROTATE_LEFT, ROTATE_RIGHT, STRAFE_WEST, STRAFE_EAST, STRAFE_NORTH, STRAFE_SOUTH, ZOOM_OUT, ZOOM_IN, DRAG
}
