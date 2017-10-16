import {Entity} from "./Entity";
import {Component} from "../components/Component";

export class EntityUtils {
    private static currentEntityId = Number.MIN_VALUE;
    private static entities: { [id: number]: Entity } = {}

    private static comp2Entities: { [name: string]: Entity[] } = {};
    private static compWatchers: { [system: string]: Entity[] } = {};
    //FIXME was ist wenn sich mehere Componenten ändern/gelöscht werden/erzeugt werden
    private static entitiesCreated: { [id: number]: Entity } = {}
    private static entitiesRemoved: { [id: number]: Entity } = {}
    private static entitiesUpdated: { [id: number]: Entity } = {}

    static createEntity(): Entity {
        var e = new Entity();
        e.id = EntityUtils.currentEntityId;
        EntityUtils.currentEntityId++;
        EntityUtils.entities[e.id] = e;
        EntityUtils.entitiesCreated[e.id] = e;
        return e;
    }

    static removeEntity(entity: Entity): void {
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

    static findEntities(type1: Component, type2?: Component): Entity[] {
        if (type2) {
            var ents = EntityUtils.comp2Entities[type1.key()]
            if (!ents) {
                return;
            }
            return ents.filter(() => {
                EntityUtils.comp2Entities[type2.key()]
            });
        } else return EntityUtils.comp2Entities[type1.key()]

    }

    static updateComponent(entityId: Entity, component: Component): void {
        EntityUtils.entitiesUpdated[entityId.id] = entityId;
    }

    static removeComponent(entityId: Entity, type: any) {
        EntityUtils.entitiesRemoved[entityId.id] = entityId;
    }

    static applyChanges(): boolean {
        for (var nr in EntityUtils.entitiesRemoved) {
            delete EntityUtils.entities[nr];
        }
        for (var n1 in EntityUtils.entitiesUpdated) {
            var ent = EntityUtils.entitiesUpdated[nr];
            EntityUtils.entities[nr] = ent;
        }
        EntityUtils.entitiesRemoved = []
        EntityUtils.entitiesUpdated = []
        EntityUtils.entitiesCreated = []
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