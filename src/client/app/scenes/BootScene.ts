import Phaser from "phaser";

import Tilemap = Phaser.Tilemaps.Tilemap;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import {System, World} from "@colyseus/ecs";
import {State} from "../../../common/components/components";
import {Client} from "colyseus.js";
import {DebugSystem} from "../../../common/systems/DebugSystem";
import {getControlSystem} from "../systems/controlSystem";
import InGame from "./inGame";
import {preloadLevelSystem} from "../systems/level";

export class BootScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    create ()
    {
        this.add.text(0, 0, 'Click to start the game');

        this.input.once('pointerdown', () => {
        
            this.scene.add('myScene', InGame, true, { x: 400, y: 300 });

        }, this);
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

}