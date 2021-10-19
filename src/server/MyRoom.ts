import {State, World} from "@colyseus/ecs"
import {Room, Client} from "colyseus";
import {InputSystem} from "./systems/InputSystem";
import createLevelSystem, {preloadLevelSystem} from "../server/systems/level";

import config from "../client/config"
import Tilemap = Phaser.Tilemaps.Tilemap;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import {getMovementSystem, preloadMovementSystem} from "./systems/MovementSystem";
import InGame from "../server/scenes/InGame";
import {registerComponents} from "../shared/utils";
import {InputComponent} from "../shared/components/InputComponent";
import Phaser from "phaser";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import {DebugSystem} from "../shared/systems/DebugSystem";

export class MyRoom extends Room<State> {

    // private map!: Tilemap
    // private groundLayer!: TilemapLayer
    world = new World();
    game!: Phaser.Game

    onCreate(options: any) {
        const config = {
            type: Phaser.AUTO,
            parent: 'game',
            backgroundColor: '#33A5E7',
            scale: {
                width: 800,
                height: 600,
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            scene: {
                plugins: {
                    scene: [{
                        key: 'rexBoard',
                        plugin: BoardPlugin,
                        mapping: 'rexBoard'
                    },
                    ]
                }
            },

        }
        this.setState(new State());
        this.game = new Phaser.Game(config)
        this.game.scene.add('myScene', InGame, true, { world: this.world});

        this.world
            .useEntities(this.state.entities);


        this.setSimulationInterval((delta) => {
            //FIXME migrate this to phaser gameloop
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
        console.log("client joined: " + client.sessionId)
        const player = this.world.createEntity()
            .addComponent(InputComponent)
    }


    async onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left", {consented});

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
