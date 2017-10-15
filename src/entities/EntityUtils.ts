import {Entity} from "./Entity";
import {Component} from "../components/Component";

export class EntityUtils {
    private static currentEntityId = Number.MIN_VALUE;
    private static entities: { [id: number]: Entity } = {}
    private static comp2Entities: { [name: string]: Entity[] } = {};
    private static entitiesCrated: { [id: number]: Entity } = {}
    private static entitiesRemoved: { [id: number]: Entity } = {}
    private static entitiesUpdated: { [id: number]: Entity } = {}

    static createEntity(): Entity {
        var e = new Entity();
        e.id = EntityUtils.currentEntityId;
        EntityUtils.currentEntityId++;
        EntityUtils.entities[e.id] = e;
        EntityUtils.entitiesCrated[e.id] = e;
        return e;
    }

    static removeEntity(entity: Entity): void {
        delete EntityUtils.entities[entity.id]
    }

    static addComponent(entity: Entity, comp: Component): void {
        var foundEntities = EntityUtils.comp2Entities[comp.constructor.name];
        if (!foundEntities) {
            foundEntities = [];
            EntityUtils.comp2Entities[comp.constructor.name] = foundEntities;
        }
        foundEntities.push(entity);
    }

    static findEntities(type1: Component, type2?: Component): Entity[] {
        if (type2) {
            var ents = EntityUtils.comp2Entities[(type1 as any).name]
            if (!ents) {
                return ;
            }
            return ents.filter(() => {
                EntityUtils.comp2Entities[(type2 as any).name]
            });
        } else return EntityUtils.comp2Entities[(type1 as any).name]

    }

    static setComponent(entityId: Entity, component: Component): void {
        EntityUtils.entitiesUpdated[entityId.id] = entityId;
    }

    static removeComponent(entityId: Entity, type: any) {
        EntityUtils.entitiesRemoved[entityId.id] = entityId;
    }
<
    // getComponent<T extends Component>( entityId: Entity , type:T): T;

    static getEntity(entityId: number): Entity {
        return this.entities[entityId];
    }

    /* public EntityId findEntity( ComponentFilter filter, Class... types ):Entity;
     public Set<EntityId> findEntities( ComponentFilter filter, Class... types );

     public EntitySet getEntities( Class... types );
     public EntitySet getEntities( ComponentFilter filter, Class... types );

     public WatchedEntity watchEntity( EntityId entityId, Class... types );

     public StringIndex getStrings();

     public close():void;*/
}