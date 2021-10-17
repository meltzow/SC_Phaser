import {Entity, World} from "@colyseus/ecs"
import { Room, Client } from "colyseus";
import { State } from "./components/components";
import {InputComponent} from "./components/InputComponent";
import {registerComponents} from "./utils";
import {InputSystem} from "../server/systems/InputSystem";
import {Level} from "./components/Level";
import createLevelSystem from "../server/systems/level";
import GameScene from "../scenes/Game"
import config from "../client/config"
import Tilemap = Phaser.Tilemaps.Tilemap;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import {getMovementSystem} from "../server/systems/MovementSystem";


export class MyRoom extends Room<State> {

    private map!: Tilemap
    private groundLayer!: TilemapLayer
    world = new World();
    game = new Phaser.Game(
        Object.assign(config, {
            scene: [GameScene]
        })
    );

    onCreate(options: any) {
        this.setState(new State());

        this.world
            .useEntities(this.state.entities);

        const references = {map: this.map, layer: this.groundLayer}
        registerComponents(this.world)
        this.world.registerSystem(InputSystem)
        //TODO: better scene handle
        const level = createLevelSystem(this.game.scene.scenes[0], this.game, this.world, references)
        this.world.registerSystem(level)
        const mov = getMovementSystem(map, undefined, {board: undefined, spriteMap: undefined})
        this.world.registerSystem(mov)

        this.setSimulationInterval((delta) => {
            this.world.execute(delta);
        });

        this.onMessage("*", (client, type, message) => {
            this.clients.find(value =>
               value.sessionId == client.sessionId
            )
            InputSystem.setInput(message)
            console.log("server receives a message from client [" + client.sessionId + "]click @ [" + message!.mouseX + "," + message!.mouseY + "]")
        });
    }

    onJoin(client: Client, options: any) {
        console.log("client joined: "+ client.sessionId)
        const player = this.world.createEntity()
                .addComponent(InputComponent)
    }


    async onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left", { consented });

        try {
            if (consented) {
                /*
                 * Optional:
                 * you may want to allow reconnection if the client manually closed the connection.
                 */
                throw new Error("left_manually");
            }

            await this.allowReconnection(client, 60);
            console.log("Reconnected!");

            client.send("status", "Welcome back!");

        } catch (e) {
            console.log(e);

        }


    }

    onDispose() {
        this.world.stop();
    }


}
