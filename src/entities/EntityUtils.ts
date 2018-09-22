import {Entity} from "./Entity";
import {Component} from "typed-ecstasy"
import * as Collections from 'typescript-collections';

export class EntityUtils {
    private static currentEntityId = Number.MIN_VALUE;
    public static entities: { [id: number]: Entity } = {}

    //private static comp2Entities: { [name: string]: Entity[] } = {}
    //private static compWatchers: { [system: string]: Entity[] } = {}

    // public static entitiesCreated: Collections.Set<number> = new Collections.Set()
    // public static entitiesRemoved: Collections.Set<number> = new Collections.Set()
    //
    // public static entitiesUpdated: Collections.MultiDictionary<Entity, Component> = new Collections.MultiDictionary((key) => {
    //     return key.id.toString()
    // }, (value1, value2) => {
    //     return value1.key() == value2.key()
    // }, false);

    // public static entitiesRemoveComponent: Collections.MultiDictionary<Entity, Component> = new Collections.MultiDictionary((key) => {
    //     return key.id.toString()
    // }, (value1, value2) => {
    //     return value1.key() == value2.key()
    // }, false);

    static createEntity(): Entity {
        var e = new Entity();
        e.id = EntityUtils.currentEntityId;
        EntityUtils.currentEntityId++;
        EntityUtils.entities[e.id] = e;
        // EntityUtils.entitiesCreated.add(e.id);
        return e;
    }

    static removeEntity(entity: Entity): void {
        // EntityUtils.entitiesRemoved.add(entity.id);
        delete EntityUtils.entities[entity.id]
    }

    /*static addComponent(entity: Entity, comp: Component): void {
        var foundEntities = EntityUtils.comp2Entities[comp.key()];
        if (!foundEntities) {
            foundEntities = [];
            EntityUtils.comp2Entities[comp.key()] = foundEntities;
        }
        foundEntities.push(entity);
    }*/

    static findEntity(type1: Component, type2?: Component, type3?: Component): Entity {
        return EntityUtils.findEntities(type1, type2,type3)[0];
    }

    static findEntities(type1: Component, type2?: Component, type3?: Component): Entity[] {
        let founds: Entity[] = []
            for (const entityId in this.entities) {
                let ent = this.entities[entityId]
                if (ent.hasComponent(type1) && !type2) {  
                    
                    if (type2 && ent.hasComponent(type2)) {
                        if (type3 && ent.hasComponent(type3)) {
                            founds.push(ent)
                        } else {
                            founds.push(ent)
                        }
                    } else {
                        founds.push(ent) 
                    }
                }
            }
        return founds
    }

    static applyChanges(): boolean {
        return true;
    }

    static getEntity(entityId: number): Entity {
        return this.entities[entityId];
    }

}