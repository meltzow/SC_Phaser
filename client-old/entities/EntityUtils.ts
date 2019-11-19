import {Entity} from "./Entity";
import {Component} from "../components/Component";
import * as Collections from 'typescript-collections';

export class EntityUtils {
    private static currentEntityId = Number.MIN_VALUE;
    public static entities: { [id: number]: Entity } = {}

    private static comp2Entities: { [name: string]: Entity[] } = {}
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

    static addComponent(entity: Entity, comp: Component): void {
        var foundEntities = EntityUtils.comp2Entities[comp.key()];
        if (!foundEntities) {
            foundEntities = [];
            EntityUtils.comp2Entities[comp.key()] = foundEntities;
        }
        foundEntities.push(entity);
    }

    static findEntity(type1: Component, type2?: Component): Entity {
        return EntityUtils.findEntities(type1, type2)[0];
    }

    static findEntities(type1: Component, type2?: Component): Entity[] {
        if (type2) {
            var ents1 = EntityUtils.comp2Entities[type1.key()]
            if (!ents1) {
                return;
            }
            var ents2 = EntityUtils.comp2Entities[type2.key()]
            if (!ents2) {
                return;
            }
            return ents1.filter((ent) => {
                return ents2.indexOf(ent) > -1;
            });
        } else {
            var founds = EntityUtils.comp2Entities[type1.key()];
            if (founds) {
                return founds
            }
            return null
        }

    }

    static updateComponent(entity: Entity, component: Component): void {
        //EntityUtils.entitiesUpdated.setValue(entity, component);
    }

    static removeComponent(entityId: Entity, component: Component) {
        // EntityUtils.entitiesRemoved.add(entityId.id)
        delete EntityUtils.entities[entityId.id]
    }

    static applyChanges(): boolean {
        // EntityUtils.entitiesRemoved.clear();
        // EntityUtils.entitiesUpdated.clear();
        // EntityUtils.entitiesCreated.clear();
        // EntityUtils.entitiesRemoveComponent.clear();
        return true;
    }

    // getComponent<T extends Component>( entityId: Entity , type:T): T;

    static getEntity(entityId: number): Entity {
        return this.entities[entityId];
    }

    /* public EntityId findEntity( ComponentFilter filter, Class... types ):Entity;
     public Set<EntityId> findEntities( ComponentFilter filter, Class... types );

     public EntitySet getEntities( Class... types );
     public EntitySet getEntities( ComponentFilter filter, Class... types ); */

    /*  static watchEntities(cb: (entity: Entity) => {}, types: Component[]) {
          EntityUtils.findEntities(types).forEach((entity) => {
              EntityUtils.compWatchers[entity];

          })
          throw new Error("not implemented now");
      };
  */
    /* public StringIndex getStrings();

         public close():void;*/

}