import {Entity} from "./Entity";
import {Component} from "../components/Component";

export class EntityUtils {
    private static currentEntityId = Number.MIN_VALUE;
    private static entities: { [id: number]: Entity } = {}
    private static comp2Entities: { [name: string]: Entity[] } = {};

    static createEntity(): Entity {
        var e = new Entity();
        e.id = EntityUtils.currentEntityId;
        EntityUtils.currentEntityId++;
        EntityUtils.entities[e.id] = e;
        return e;
    }

    static removeEntity(entity: Entity): void {
        delete EntityUtils.entities[entity.id]
    }

    static addComponent(entity: Entity, comp: Component): void {
        var foundEntities =  EntityUtils.comp2Entities[comp.constructor.name];
        if (!foundEntities) {
            foundEntities = [];
            EntityUtils.comp2Entities[comp.constructor.name] = foundEntities;
        }
        foundEntities.push(entity);
    }

    static findEntities(type: Component): Entity[] {
        return EntityUtils.comp2Entities[(type as any).name];
   }

    //setComponent( entityId:Entity , component: Component  ): void;
    //removeComponent( entityId:Entity , type: any ):boolean;

    // getComponent<T extends Component>( entityId: Entity , type:T): T;

    /* public Entity getEntity( EntityId entityId, Class... types ): Entity;
     public EntityId findEntity( ComponentFilter filter, Class... types ):Entity;
     public Set<EntityId> findEntities( ComponentFilter filter, Class... types );

     public EntitySet getEntities( Class... types );
     public EntitySet getEntities( ComponentFilter filter, Class... types );

     public WatchedEntity watchEntity( EntityId entityId, Class... types );

     public StringIndex getStrings();

     public close():void;*/
}