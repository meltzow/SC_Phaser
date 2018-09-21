import {Component, ComponentClass} from "../components/Component";
import {EntityUtils} from "./EntityUtils";
import * as Collections from 'typescript-collections';
import {IEqualsFunction} from "typescript-collections/dist/lib/util";

export class Entity {
    id: number
    private components: Collections.Set<Component> = new Collections.Set(Entity.comp2Key)

    private static comp2Key(comp:Component) {
        return comp.key();
    }

    
    hasComponent(comp:Component): boolean {
        return !!comp && this.components.contains(comp);
    }

    delComponent(comp: Component):void {
        var foundComp = this.hasComponent(comp)
        if (foundComp) {
            this.components.remove(comp)
        }
    }

    addOrUpdateComponent(comp: Component):void {
        this.delComponent(comp)
        this.components.add(comp);
    }


    get<T extends Component>(comp: { new(obj?): T; key(): string }): T {
        return ( this.components.toArray().find((value: Component) => {
            return value.key() == comp.key()
        }) as any)
    }

    toString():string {
        return this.id.toString() + this.components;
    }

    /*function (a: Entity, b: Entity): boolean {
        return true;
    }*/
}