import {BaseSystem} from "./BaseSystem";
import {Component, ComponentClass} from "../components/Component";
import {EntityUtils} from "../entities/EntityUtils";
import {Motion} from "../components/Motion";

export class MotionSystem extends BaseSystem {

    constructor() {
       super([Motion]);
    }

    update(game:Phaser.Game) {
       var entities =  EntityUtils.findEntities(Motion);
       console.log("motionsystem is called with", entities)
    }
}