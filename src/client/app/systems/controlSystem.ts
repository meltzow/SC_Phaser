import Phaser, {Game, Scene} from 'phaser'

import FixedKeyControl = Phaser.Cameras.Controls.FixedKeyControl;
import {System} from "@colyseus/ecs";
import {Client, Room} from "colyseus.js";
import {InputComponent} from "../../../common/components/InputComponent";

export function getControlSystem(scene: Phaser.Scene, game: Phaser.Game, room: Room) {

    return class ControlSystem extends System {

        static queries = {
            input: { components: [InputComponent]},
        }

        controls: FixedKeyControl | undefined
        inputState: InputComponent | undefined

        init() {
            const cursors = scene.input.keyboard.createCursorKeys();
            const controlConfig = {
                camera: scene.cameras.main,
                left: cursors.left,
                right: cursors.right,
                up: cursors.up,
                down: cursors.down,
                speed: 0.5,
                zoomIn: scene.input.keyboard.addKey('A'),
                zoomOut: scene.input.keyboard.addKey('Q')
            };

            this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)
            scene.input.on("pointerdown", () => {

                this.inputState =  new InputComponent()
                // this.inputState.mouseX = game.input.activePointer.worldX
                // this.inputState.mouseY = game.input.activePointer.worldY
                this.inputState.mouseX = 100
                this.inputState.mouseY = 100
                console.log("I click inside the phaser client @ [" + this.inputState.mouseX + "," + this.inputState.mouseY + "]")
                room.send("pointerdown", {mouseX:100, mouseY:100})
            })
        }

        execute(delta: number, time: number): void {

           // @ts-ignore
           // if (this.queries.input.changed) {
           //      const context = this.queries.input.changed[0]
           //      let inputComponent = context.getMutableComponent(InputComponent);
           //  }


            this.controls!.update(delta)
        }

        // inputDown() {
        //     let playerEnt = ControlSystem.queries.player.results[0]
        //     let inputComp = playerEnt.getMutableComponent(InputComponent)
        //     inputComp!.mouseX = game.input.activePointer.worldX
        //     inputComp!.mouseY = game.input.activePointer.worldY
        // }
    }
}
