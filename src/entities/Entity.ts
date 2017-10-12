import {Component} from "../components/Component";
import {EntityUtils} from "./EntityUtils";

export class Entity {
    id: number
    private components: Component[] = []

    addComponent(comp: Component) {
        this.components.push(comp);
        EntityUtils.addComponent(this, comp);
    }
}