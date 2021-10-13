import { World } from "@colyseus/ecs"
import { Room, Client } from "colyseus";
import { State } from "./components/components";
import { MovementSystem } from "./systems/MovementSystem";
import { random } from "./utils";
import { Schema } from "@colyseus/schema";
import {IntersectionSystem} from "./systems/IntersectionSystem";
import {Player} from "./components/Player";
import {InputComponent} from "./components/InputComponent";
import {DebugSystem} from "./systems/DebugSystem";
import {getControlSystem} from "../client/controlSystem";
import {SimulateInputSystem} from "./systems/SimulateInputSystem";


export class MyRoom extends Room<State> {
    world = new World();

    onCreate(options: any) {
        this.setState(new State());

        this.world
            .useEntities(this.state.entities);

        console.log("myroom entities " + this.state.toConsole())

        this.world
            // .registerComponent(Player)
            .registerComponent(InputComponent)
            // .registerSystem(SimulateInputSystem)
            .registerSystem(DebugSystem)
            // .registerComponent(Intersecting)
            // .registerComponent(CanvasContext)
            // .registerComponent(DemoSettings)
            // .registerSystem(MovementSystem)
            // .registerSystem(IntersectionSystem);
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
        console.log("myroom entities " + this.state.toConsole())


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
            //
            // Triggers when any other type of message is sent,
            // excluding "action", which has its own specific handler defined above.
            //
            console.log(client.sessionId, "sent", type, message);
        });
    }

    onJoin(client: Client, options: any) {
        console.log("client joined: "+ client.id)
        const player = this.world.createEntity()
            // .addComponent(Player)
            .addComponent(InputComponent)
        console.log("myroom entities " + this.state.toConsole())
        // player.getMutableComponent(InputComponent)!.mouseX = 100
    }


    onLeave(client: Client, consented: boolean) {
        console.log("client left: "+ client.id)
    }

    onDispose() {
        this.world.stop();
    }


}
