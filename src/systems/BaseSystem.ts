/**
 * As an abstract class, it is intended to by extended into many specific and grained piece of logic. Each System needs to
 * subscribe to one or more entity set, then can manage the events occurring on these sets.
 */
abstract class BaseSystem {
    entities: Entity[]


    public update(elapsedTime: number): void {
        //try {
            this.entities.forEach(entity => {
                for (Entity e : set.getChangedEntities()) {
                    onEntityUpdated(e);
                }
                for (Entity e : set.getAddedEntities()) {
                    onEntityAdded(e);
                }
                for (Entity e : set.getRemovedEntities()) {
                    onEntityRemoved(e);
                }
                for (Entity e : set) {
                    onEntityEachTick(e);
                }
            });
            onUpdated();
        //} catch (e exception) {
            //LoggerFactory.getLogger(getClass()).error("Exception in processor : " + this.getClass().getSimpleName() + " : " + e.getMessage());
        //    e.printStackTrace();

        //}
    }

   /* cleanup(): void {
        for (EntitySet set : sets.values())
        for (Entity e : set)
        onEntityRemoved(e);
        onCleanup();
        for (EntitySet set : sets.values())
        set.release();
        super.cleanup();
    }
*/


    /**
     * Creates a specific and nammed entity set with the given component classes.
     * Used to work with many entity sets.
     * @param compClass
     */
    /*protected register(String setName, Class <? extends EntityComponent >... compClass): void {
    sets.put(setName, entityData.getEntities(compClass));
}

    /**
     * Return the default entity set, or null if it hasn't been registered.
     * @return
     */
    /*protected EntitySet getDefaultSet(){
        return sets.get("");
    }

    /**
     * Return the specific entity set found by its name, or null if it hasn't been registered.
     * @return
     */
    /*protected EntitySet getSet(String setName){
    return sets.get(setName);
}

    /**
     * Convenient method to quickly assign a component to an entity from a registered set.
     * @return
     */
   /* protected setComp(Entity e, EntityComponent comp): void{
    entityData.setComponent(e.getId(), comp);
}

    /**
     * Convenient method to quickly remove a component from entity from a registered set.
     * @return
     */
    /*protected removeComp(e: Entity, Class < extends Component > compClass){
    entityData.removeComponent(e.getId(), compClass);
}

    /**
     * Each Processor must override this method and declare to which set of component class it will react.
     *
     * It is allowed to register to nothing, and consider the processor as a basic app state.
     *
     * @return entity used with this system.
     */
   /* protected abstract void registerSets();

    /**
     * User code called after initialization, to complete the processor.
     * Called by the state manager.
     * The state manager to which the processor is attached is given in parameter, to allow communication between app state.
     * Note : initialization occurred at the end of the state manager initialization. It's best practice to attach all your
     * processors at the same moment, to have them accessible at this method call. 
     * @param stateManager
     */
    /*protected onInitialized(AppStateManager stateManager): void {}

    /**
     * Called each frame.
     *
     * @param tpf
     */
    protected  onUpdated(): void {}

    /**
     * Called when an entity is added to one of the registered set.
     *
     * @param e entity to add.
     */
    /*protected onEntityAdded(Entity e): void{}

    /**
     * Called when an entity got an update in one of the registered set.
     *
     * @param e updated entity.
     */
   /* protected onEntityUpdated(Entity e): void{}

    /**
     * Called when an entity is removed from one of the registered set.
     *
     * @param e removed entity.
     */
    /*protected onEntityRemoved(Entity e): void{}

    /**
     * Called each tick for each entity in the registered sets.
     *
     * @param e removed entity.
     */
   /* protected onEntityEachTick(Entity e): void{}

    /**
     * Called when the system is removed, used to clean his mess.
     */
   /* protected onCleanup(): void{} */
}