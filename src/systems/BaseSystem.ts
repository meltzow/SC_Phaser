/**
 * As an abstract class, it is intended to by extended into many specific and grained piece of logic. Each System needs to
 * subscribe to one or more entity set, then can manage the events occurring on these sets.
 */
import {Component, ComponentClass} from "../components/Component";

export abstract class BaseSystem {

    private components:ComponentClass[] = [];

    constructor(compClasses:ComponentClass[]) {
        this.components = compClasses;
    }

    //protected entityData: EntityData;
    //private sets: { [key: string]: EntitySet } = {};
    create(object, options, game:Phaser.Game) {
        // called when the behavior is ADDED to a game object
    }

    destroy(object, options, game) {
        // called when the behavior is REMOVED to a game object
    }

    preUpdate(object, options, game) {
        // called at the very start of the update cycle,
        // before any other subsystems have been updated (including Physics)
    }

    update(game:Phaser.Game) {
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