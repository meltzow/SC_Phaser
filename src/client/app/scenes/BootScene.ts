import Phaser from "phaser";

import Tilemap = Phaser.Tilemaps.Tilemap;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import {System, World} from "@colyseus/ecs";
import {State} from "../../../common/components/components";
import {Client} from "colyseus.js";
import {DebugSystem} from "../../../common/systems/DebugSystem";
import {getControlSystem} from "../systems/controlSystem";
import Hero from "./hero";

export class BootScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private map!: Tilemap
    private groundLayer!: TilemapLayer

    rexBoard!: BoardPlugin
    board!: BoardPlugin.Board;
    print!: Phaser.GameObjects.Text;
    cameraController!: Phaser.Cameras.Controls.SmoothedKeyControl
    private gameContainer!: HTMLElement;
    private eventEmitter: Phaser.Events.EventEmitter;
    private spriteMap: Map<number, Phaser.GameObjects.Sprite> = new Map<number, Phaser.GameObjects.Sprite>()
    // @ts-ignore
    private client: Client;
    private world: World | undefined;

    create ()
    {
        this.add.text(0, 0, 'Click to add new Scene');

        this.input.once('pointerdown', () => {
        
            this.scene.add('myScene', Hero, true, { x: 400, y: 300 });

        }, this);
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update(time: number, delta: number) {
        this.world!.execute(delta)
    }

    resizeGameContainer() {
        const winW = window.innerWidth / window.devicePixelRatio;
        const winH = window.innerHeight / window.devicePixelRatio;
        const breakpoints = [{ scrW: 0, gamW: 400 }, { scrW: 600, gamW: 450 }, { scrW: 900, gamW: 550 }, { scrW: 1200, gamW: 750 }, { scrW: 1500, gamW: 1000 }, { scrW: 1800, gamW: 1300 }];
        let currentBreakpoint = null;
        let newViewPortW = 0;
        let newViewPortH = 0;

        for (let i = 0; i < breakpoints.length; i++)
        {
            currentBreakpoint = breakpoints[i];

            if (winW < currentBreakpoint.scrW)
            {
                break;
            }
        }

        // @ts-ignore
        newViewPortW = currentBreakpoint.gamW;
        // @ts-ignore
        newViewPortH = currentBreakpoint.gamW * (winH / winW);

        this.game.scale.resize(newViewPortW, newViewPortH);

        // this.gameContainer.style.width = `${window.innerWidth}px`;
        // this.gameContainer.style.height = `${window.innerHeight}px`;
        // this.game.canvas.style.width = `${window.innerWidth}px`;
        // this.game.canvas.style.height = `${window.innerHeight}px`;

        this.eventEmitter.emit('screenResized');
    }

}