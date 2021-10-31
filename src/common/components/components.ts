import * as ECS from "@colyseus/ecs";
import {type, Schema, ArraySchema, MapSchema} from "@colyseus/schema";

export interface Component {
    getName(): string
}

