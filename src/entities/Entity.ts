import {Component, ComponentClass} from "../components/Component";
import {EntityUtils} from "./EntityUtils";
import * as Collections from 'typescript-collections';
import {IEqualsFunction} from "typescript-collections/dist/lib/util";

export class Entity {
    id: number
    private components: Collections.Set<Component> = new Collections.Set()

    delComponent(comp: Component) {
        EntityUtils.removeComponent(this, comp)
    }

    addComponent(comp: Component) {
        if (this.components.contains(comp)) {
            EntityUtils.updateComponent(this, comp)
        } else {
            EntityUtils.addComponent(this, comp);
        }
        this.components.add(comp);
    }


    get<T extends Component>(comp: { new(obj?): T; key(): string }): T {
        return ( this.components.toArray().find((value: Component) => {
            return value.key() == comp.key()
        }) as any)
    }

    toString() {
        return this.id;
    }

    /*function (a: Entity, b: Entity): boolean {
        return true;
    }*/
}