import {Component} from "../components/Component";
import {EntityUtils} from "./EntityUtils";

export class Entity {
    id: number
    private components: Component[] = []

    addComponent(comp: Component) {
        this.components.push(comp);
        EntityUtils.addComponent(this, comp);
    }

    get<T extends Component>(comp: { new (): T }): T {
        return ( this.components.find((value: Component) => {
            return value.constructor.name == comp.name
        }) as any)
    }
}