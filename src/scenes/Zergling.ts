// GameObject Skeleton
import Phaser from "phaser";

type direction = {
    [name: string]: {
        offset: number,
        x: number,
        y: number,
        opposite: string
    }
}

const directions: direction = {
    north: {offset: 0, x: 0, y: -2, opposite: 'south'},
    northEast: {offset: 96, x: 2, y: -1, opposite: 'southWest'},
    east: {offset: 128, x: 2, y: 0, opposite: 'west'},
    southEast: {offset: 160, x: 2, y: 1, opposite: 'northWest'},
    south: {offset: 9, x: 0, y: 2, opposite: 'north'},
    southWest: {offset: 224, x: -2, y: 1, opposite: 'northEast'},
    west: {offset: 0, x: -2, y: 0, opposite: 'east'},
    northWest: {offset: 32, x: -2, y: -1, opposite: 'southEast'},
};

type animation = {
    [name: string]: {
        startFrame: number,
        endFrame: number,
        speed: number
    }
}

var anims : animation = {
    idle: {
        startFrame: 0,
        endFrame: 4,
        speed: 0.2
    },
    walk: {
        startFrame: 0,
        endFrame: 12,
        speed: 0.15
    },
    attack: {
        startFrame: 12,
        endFrame: 20,
        speed: 0.11
    },
    die: {
        startFrame: 20,
        endFrame: 28,
        speed: 0.2
    },
    shoot: {
        startFrame: 28,
        endFrame: 32,
        speed: 0.1
    }
};

export class Zergling extends Phaser.GameObjects.Image {
    startX: number;
    startY: number;
    distance: any;
    motion: any;
    anim: any;
    direction: any;
    speed: number;
    currentFrame: any;
    // frames: number[];

    constructor(scene: Phaser.Scene, x: number, y: number, motion: string, direction: any, distance: number) {
        super(scene, x, y, 'zergling', direction.offset);
        this.scene = scene;

        this.startX = x;
        this.startY = y;
        this.distance = distance;


        this.motion = motion;
        this.anim = anims[motion];
        this.direction = directions[direction];
        this.speed = 0.15;
        this.currentFrame = this.anim.startFrame;

        this.depth = y + 64;

        scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
        // this.scene.anims.create({
        //     key: 'zergling-walk',
        //     this.frames = this.scene.anims.generateFrameNumbers('walk', {frames: [0*18, 1*18,2*18,3+18, 4*18, 5*18,6*18, 7*18]} );
        // })
        // this.frames = [0*18, 1*18,2*18,3*18, 4*18, 5*18,6*18, 7*18, 8*18, 9*18, 10*18, 11*18];
    }

    changeFrame() {
        this.currentFrame+=18;

        var delay = this.anim.speed;

        if (this.currentFrame === this.anim.endFrame * 18) {
            switch (this.motion) {
                case 'walk':
                    this.currentFrame = this.anim.startFrame;
                    this.frame = this.texture.get(this.direction.offset + this.currentFrame);
                    this.scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
                    break;

                case 'attack':
                    delay = Math.random() * 2;
                    this.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;

                case 'idle':
                    delay = 0.5 + Math.random();
                    this.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;

                case 'die':
                    delay = 6 + Math.random() * 6;
                    this.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;
            }
        } else {
            this.frame = this.texture.get(this.direction.offset + this.currentFrame);

            this.scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
        }
    }

    resetAnimation() {
        this.currentFrame = this.anim.startFrame;

        this.frame = this.texture.get(this.direction.offset + this.currentFrame);

        this.scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    }

    update() {
        if (this.motion === 'walk') {
            this.x += this.direction.x * this.speed;

            if (this.direction.y !== 0) {
                this.y += this.direction.y * this.speed;
                this.depth = this.y + 64;
            }

            //  Walked far enough?
            if (Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y) >= this.distance) {
                this.direction = directions[this.direction.opposite];
                this.currentFrame = this.anim.startFrame;
                this.frame = this.texture.get(this.direction.offset + this.currentFrame);
                this.startX = this.x;
                this.startY = this.y;
            }
        }
    }
}
