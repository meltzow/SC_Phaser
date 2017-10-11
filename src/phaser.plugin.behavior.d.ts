declare namespace Phaser.Plugin {

    class Behavior extends Phaser.Plugin {
        enable(object: Phaser.Sprite):boolean
    }
}

declare namespace Behavior {

    interface BehaviorSprite extends Phaser.Sprite {
        behaviorPlugin: Phaser.Plugin.Behavior;
    }

    interface IBehavior {
        /**
         *  called when the behavior is ADDED to a game object
         * @param {Behavior.BehaviorSprite} object
         * @param options
         * @param {Phaser.Game} game
         */
        create(object:BehaviorSprite, options, game: Phaser.Game)

        /**
         * called when the behavior is REMOVED to a game object
         * @param {Behavior.BehaviorSprite} object
         * @param options
         * @param {Phaser.Game} game
         */
        destroy(object:BehaviorSprite, options, game: Phaser.Game)

        /**
         *  called at the very start of the update cycle before any other subsystems have been updated (including Physics)
         * @param {Behavior.BehaviorSprite} object
         * @param options
         * @param {Phaser.Game} game
         */
        preUpdate(object:BehaviorSprite, options, game: Phaser.Game)

        /**
         *  called after all the core subsystems (Input, Tweens, Sound, etc) and the State have updated, but before the render
         * @param {Behavior.BehaviorSprite} object
         * @param options
         * @param {Phaser.Game} game
         */
        update(object:BehaviorSprite, options, game: Phaser.Game)

        /**
         * called right after the Game Renderer completes, but before the State.render
         * @param {Behavior.BehaviorSprite} object
         * @param options
         * @param {Phaser.Game} game
         */
        render(object:BehaviorSprite, options, game: Phaser.Game)

        /**
         * called after the Game Renderer and State.render have run
         * @param {Behavior.BehaviorSprite} object
         * @param options
         * @param {Phaser.Game} game
         */
        postRender(object:BehaviorSprite, options, game: Phaser.Game)
    }
}
