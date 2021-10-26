import Phaser from "phaser";
import {HeroesState} from "../../../common/types/states";
import Server from "../services/server";
import Tilemap = Phaser.Tilemaps.Tilemap;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import {System, World} from "@colyseus/ecs";
import {State} from "../../../common/components/components";
import {Client, Room} from "colyseus.js";
import {DebugSystem} from "../../../common/systems/DebugSystem";
import {registerComponents} from "../../../common/utils";
import {getControlSystem} from "../systems/controlSystem";
import HeroRoom from "../../../server/game/rooms";
import {Level} from "../../../common/components/Level";
import createLevelSystem, {preloadLevelSystem} from "../systems/level";
import createSpriteSystem from "../systems/sprite";

export default class InGame extends Phaser.Scene {
    private server!: Server;
    private playersMessage: Phaser.GameObjects.Text;
    private spriteMap: Map<number, Phaser.GameObjects.Sprite> = new Map<number, Phaser.GameObjects.Sprite>()
    private world: World | undefined;

    init(): void {
        this.server = new Server();
    }

    preload()
    {
        preloadLevelSystem(this)
    }

    async create(): Promise<void> {
        this.world = new World();
        registerComponents(this.world!)

        this.server.onRoomJoined((room: Room) => {
            const controlSystem = getControlSystem(this, this.game, room)
            this.world!.registerSystem(controlSystem)
                .registerSystem(DebugSystem)

            const dataHolder = { map: null, layer: null, spriteMap: this.spriteMap}
            const level = createLevelSystem(this, dataHolder)
            this.world.registerSystem(level)

            const spriteSystem = createSpriteSystem(this, ['tank-blue', 'tank-green', 'tank-red','link'], this.spriteMap)
            this.world.registerSystem(spriteSystem)

            this.world!.useEntities(room.state.entities);
        })

        this.server.onceStateChanged((state: State) => {

            const playerCount = state.entities.length;

            this.playersMessage = this.add
                .text(400, 300, `welcome to spacecraft: ${playerCount}`)
                .setOrigin(0.5);
        }, this);

        let previousTime = Date.now();
        this.server.onStateChanged((state: State) => {
            const playerCount = state.entities.length;
            this.playersMessage.setText(`Players connected: ${playerCount}`);

            const now = Date.now();
            //this.world?.useEntities(state.entities)
            this.world!.execute(now - previousTime);
            previousTime = now;
        });

        await this.server.join();
    }

    update(time: number, delta: number) {
        this.world!.execute(delta)
    }


}
