import {System} from "ecsy";
import {Circle, Intersecting} from "../components/components";
import {intersection} from "../utils";

export class IntersectionSystem extends System {
    static queries = {
        entities: { components: [Circle] }
    }

    execute() {
        let entities = this.queries.entities.results;

        for (var i = 0; i < entities.length; i++) {
            let entity = entities[i];

            if (entity.hasComponent(Intersecting)) {
                entity.getMutableComponent(Intersecting).points = [];
            }

            let circle = entity.getComponent(Circle);

            for (var j = i + 1; j < entities.length; j++) {
                let entityB = entities[j];
                let circleB = entityB.getComponent(Circle);

                var intersect = intersection(circle, circleB);
                if (intersect !== false) {
                    var intersectComponent;
                    if (!entity.hasComponent(Intersecting)) {
                        entity.addComponent(Intersecting);
                    }
                    intersectComponent = entity.getMutableComponent(Intersecting);
                    intersectComponent.points.push(...intersect);
                }
            }

            if (
                entity.hasComponent(Intersecting) &&
                entity.getComponent(Intersecting).points.length === 0
            ) {
                entity.removeComponent(Intersecting);
            }
        }
    }

    stop() {
        super.stop();
        // Clean up interesection when stopping
        // let entities = this.queries.entities;
        let entities = this.queries.entities.results;

        for (var i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (entity.hasComponent(Intersecting)) {
                entity.getMutableComponent(Intersecting).points = [];
            }
        }
    }
}