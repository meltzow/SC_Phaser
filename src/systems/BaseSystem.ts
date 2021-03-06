/**
 * As an abstract class, it is intended to by extended into many specific and grained piece of logic. Each System needs to
 * subscribe to one or more entity set, then can manage the events occurring on these sets.
 */
import { Component, ComponentClass } from "../components/Component";
import { Entity } from "../entities/Entity";
import { EntityUtils } from "../entities/EntityUtils";

export abstract class BaseSystem {

    public components: ComponentClass[] =  [];

    constructor(compClasses: ComponentClass[]) {
        this.components = compClasses;
    }

    create(game: Phaser.Game) {
        // called when the behavior is ADDED to a game object
    }

    destroy(object, options, game) {
        // called when the behavior is REMOVED to a game object
    }

    preUpdate(object, options, game) {
        // called at the very start of the update cycle,
        // before any other subsystems have been updated (including Physics)
    }


    onEntityUpdated(game: Phaser.Game, entity: Entity) {

    }

    onEntityAdded(game: Phaser.Game, entity: Entity) {

    }

    onEntityRemoved(game: Phaser.Game, entity: Entity) {

    }

    onEntityEachTick(game: Phaser.Game, entity: Entity) {
        // called after all the core subsystems (Input, Tweens, Sound, etc)
        // and the State have updated, but before the render
    }

    render(object, options, game) {
        // called right after the Game Renderer completes, but before the State.render
    }

    postRender(object, options, game) {
        // alled after the Game Renderer and State.render have run
    }


}