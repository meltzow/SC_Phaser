import {Component} from "../components/Component";
import {EntityUtils} from "./EntityUtils";

export class Entity {
    id: number
    private components: Component[] = []

    delComponent(comp: Component) {
        EntityUtils.removeComponent(this, comp)
    }

    addComponent(comp: Component) {
        if (this.components.indexOf(comp) > -1) {
            EntityUtils.updateComponent(this, comp)
        } else {
            EntityUtils.addComponent(this, comp);
        }
        this.components.push(comp);
    }


    get<T extends Component>(comp: { new (): T }): T {
        return ( this.components.find((value: Component) => {
            return value.constructor.name == comp.name
        }) as any)
    }
}