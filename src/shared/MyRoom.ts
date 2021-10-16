import {Entity, World} from "@colyseus/ecs"
import { Room, Client } from "colyseus";
import { State, InputComponent } from "./components/components";
import {Player} from "./components/Player";
import {DebugSystem} from "./systems/DebugSystem";
import {InputSystem} from "./systems/InputSystem";
import {getServerSystem} from "./systems/ServerSystem";


export class MyRoom extends Room<State> {

    world = new World();

    onCreate(options: any) {
        this.setState(new State());

        this.world
            .useEntities(this.state.entities);

        this.world
            .registerComponent(InputComponent)
            .registerSystem(InputSystem)
            .registerSystem(getServerSystem(this))

        //
        // // Used for singleton components
        // const singletonEntity = this.world.createEntity()
        //     .addComponent(CanvasContext)
        //     .addComponent(DemoSettings);

        // const width = 1024;
        // const height = 800;



        // const player = this.world.createEntity()
        //     // .addComponent(Player)
        //     .addComponent(InputComponent)

        // player.getMutableComponent(InputComponent)!.mouseX = 101

        // const canvasComponent = singletonEntity.getMutableComponent(CanvasContext);
        // canvasComponent!.width = width;
        // canvasComponent!.height = height;

        // for (let i = 0; i < 100; i++) {
        //     const entity = this.world
        //         .createEntity()
        //         .addComponent(Circle)
        //         .addComponent(Movement);
        //
        //     const circle = entity.getMutableComponent(Circle);
        //     circle!.position.set(random(0, width), random(0, height));
        //     circle!.radius = random(20, 100);
        //
        //     const movement = entity.getMutableComponent(Movement);
        //     movement!.velocity.set(random(-20, 20), random(-20, 20));
        // }

        this.setSimulationInterval((delta) => {
            this.world.execute(delta);
        });

        this.onMessage("*", (client, type, message) => {
            this.clients.find(value =>
               value.sessionId == client.sessionId
            )
            InputSystem.setInput(message)
            console.log("server receives a message from client [" + client.sessionId + "]click @ [" + message!.mouseX + "," + message!.mouseY + "]")

            //
            // Triggers when any other type of message is sent,
            // excluding "action", which has its own specific handler defined above.
            //
            // console.log(client.sessionId, "sent", type, message);
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
