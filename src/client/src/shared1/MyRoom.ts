import { World } from "@colyseus/ecs"
import { Room, Client } from "colyseus";
import { Circle, Movement, Intersecting, CanvasContext, DemoSettings, State } from "./components/components";
import { MovementSystem } from "./systems/MovementSystem";
import { random } from "./utils";
import { Schema } from "@colyseus/schema";
import {IntersectionSystem} from "./systems/IntersectionSystem";

export class MyRoom extends Room<State> {
    world = new World();

    onCreate(options: any) {
        this.setState(new State());

        this.world
            .useEntities(this.state.entities);

        this.world
            .registerComponent(Circle)
            .registerComponent(Movement)
            .registerComponent(Intersecting)
            .registerComponent(CanvasContext)
            .registerComponent(DemoSettings)
            .registerSystem(MovementSystem)
            .registerSystem(IntersectionSystem);

        // Used for singleton components
        var singletonEntity = this.world.createEntity()
            .addComponent(CanvasContext)
            .addComponent(DemoSettings);

        const width = 1024;
        const height = 800;

        const canvasComponent = singletonEntity.getMutableComponent(CanvasContext);
        canvasComponent.width = width;
        canvasComponent.height = height;

        for (var i = 0; i < 1000; i++) {
            var entity = this.world
                .createEntity()
                .addComponent(Circle)
                .addComponent(Movement);

            const circle = entity.getMutableComponent(Circle);
            circle.position.set(random(0, width), random(0, height));
            circle.radius = random(20, 100);

            const movement = entity.getMutableComponent(Movement);
            movement.velocity.set(random(-20, 20), random(-20, 20));
        }

        this.setSimulationInterval((delta) => {
            this.world.execute(delta);
        });
    }

    onJoin(client: Client, options: any) {
        console.log("client joined: "+ client.id)
    }

    onLeave(client: Client, consented: boolean) {
    }

    onDispose() {
        this.world.stop();
    }

}
