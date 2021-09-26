import Phaser from 'phaser'
import {addComponent, addEntity, defineQuery, defineSystem, IWorld,} from 'bitecs'

import * as InputMouseStatus from '../components/Input'
import {Utils} from "./utils";
import Position from '../components/Position'
import Player from "../components/Player";
import {EventDispatcher} from "../events/EventDispatcher";
import SelectUnits from '../events/SelectUnits'
import UnitsSelected from "../events/UnitsSelected";
import MouseClickedEvent, {ClickType, MouseButtons} from "../events/MouseClickedEvent";
import Commandable from "../components/Commandable";
import {Command, CommandType} from "../components/commands/Command";
import Selectable from "../components/Selectable";
import Unit from "../components/Unit";

export default function createControlSystem(scene: Phaser.Scene, game: Phaser.Game, world: IWorld) {

    let cursors: { left: { isDown: any }; right: { isDown: any }; up: { isDown: any }; down: { isDown: any } }; //keyboard

    const CAMERA_SPEED = 10;

    const DOUBLE_CLICK_TIME = 300;

    let clickStart: { x: number; y: number };
    let clickTime: number;

    let dragRect: Phaser.Geom.Rectangle;

    let PLAYER_ID: number

    let graphics: Phaser.GameObjects.Graphics
    let mouseStatus: InputMouseStatus.mouseStatus

    function setDragRect(x: number, y: number, w: number, h: number) {
        dragRect.x = x;
        dragRect.y = y;
        dragRect.width = w;
        dragRect.height = h;
    }


    function selectRectangle() {
        //Select all units in the drag-rectangle area
        const selected: number[] = [];
        //  Global.selectedUnits[Global.myPlayer] = [];
        console.log("Select rectangle " + dragRect.x + "," + dragRect.y + ", " + dragRect.width + "," + dragRect.height)

        const myUnitsQuery = defineQuery([Position, Selectable, Unit])
        const ids = myUnitsQuery(world)
        ids.forEach(function (unit: number) {
            // @ts-ignore
            EventDispatcher.getInstance().emit(SelectUnits.name, this, {ids: selected})
            if (Phaser.Geom.Rectangle.Contains(dragRect, Position.x[unit], Position.y[unit])) {
                selected.push(unit)
            }
            // @ts-ignore
            EventDispatcher.getInstance().emit(UnitsSelected.name, {ids: selected})
        });
        if (selected.length > 0) {
            Player.selectedUnits[PLAYER_ID] = Uint8Array.from(selected)
        }

        scene.time.addEvent({
            delay: 150, callback: function () {
                setDragRect(0, 0, 0, 0)
            }
        })

        console.log("selected units ", selected)
    }

    function select() {
        // Create tiny rectangle and use selectRectangle method
        const unitSize = 1;

        //Create tiny rectangle to see if a unit is inside
        setDragRect(game.input.activePointer.worldX - unitSize / 2, game.input.activePointer.worldY - unitSize / 2, unitSize, unitSize);
        return selectRectangle()
    }

    function selectType() {
        /*First, we select one unit with select() method,
          then we select all the other units with the same type
          Only capture those included in the camera
          */
        const selected = select()
        if (selected) {

            // const type = selected.properties().type;
            // Global.selectedUnits[PLAYER_ID] = []; //Reset selection
            setDragRect(-scene.cameras.default.worldView.x, -scene.cameras.default.worldView.y, scene.cameras.default.width, scene.cameras.default.height);

            // Utils.myUnits(PLAYER_ID, world).forEach(function(unit){
            // 	if (unit.properties().type == type) {
            // 		const p = unit.properties();
            // 		if (dragRect.contains(p.x, p.y)) Global.selectedUnits[PLAYER_ID].push(unit);
            // 	}
            // });
            setDragRect(0, 0, 0, 0)
            // dragRect.width = 0;
        }
    }

    function inputDown() {
        if (scene.input.activePointer.rightButtonDown()) return;
        if (mouseStatus != InputMouseStatus.mouseStatus.NONE) return;
        // Copy x and y values from mousepointer
        clickStart = {x: game.input.activePointer.worldX, y: game.input.activePointer.worldY};
        //console.log("Time since last click " , game.time.now - clickTime);
        if (scene.time.now - clickTime < DOUBLE_CLICK_TIME) mouseStatus = InputMouseStatus.mouseStatus.DOUBLE_CLICK;
        else mouseStatus = InputMouseStatus.mouseStatus.SINGLE_CLICK;

        clickTime = scene.time.now;
    }

    function mouseDragMove() {
        if (mouseStatus == InputMouseStatus.mouseStatus.PLACE_BUILDING || mouseStatus == InputMouseStatus.mouseStatus.CLICK_BUILDING) {
            // building.x = game.input.activePointer.worldX;
            // building.y = game.input.activePointer.worldY;
        } else if (mouseStatus != InputMouseStatus.mouseStatus.NONE) {
            //Not actual distance, but simpler formula
            const distance = Math.abs(clickStart.x - game.input.mousePointer.x) +
                Math.abs(clickStart.y - game.input.mousePointer.y);

            if (distance > 20 && scene.time.now - clickTime > 100) {
                mouseStatus = InputMouseStatus.mouseStatus.DRAG;
                setDragRect(Math.min(game.input.activePointer.worldX, clickStart.x),
                    Math.min(game.input.activePointer.worldY, clickStart.y),
                    Math.abs(game.input.activePointer.worldX - clickStart.x),
                    Math.abs(game.input.activePointer.worldY - clickStart.y));
            }
        }
    }

    function create() {
        mouseStatus = InputMouseStatus.mouseStatus.NONE
        graphics = scene.add.graphics({lineStyle: {width: 1, color: 0xff119910}});
        cursors = scene.input.keyboard.createCursorKeys();

        scene.input.on("pointerup", function () {
            const x = game.input.activePointer.worldX //clickStart.x
            const y = game.input.activePointer.worldY
            const elapsed = scene.time.now - clickTime;
            // Right click
            if (scene.input.activePointer.rightButtonReleased()) {
                EventDispatcher.getInstance().emit(MouseClickedEvent.name, new MouseClickedEvent(MouseButtons.right, x, y))
                const selectedUnits = Player.selectedUnits[PLAYER_ID]
                if (!selectedUnits) return
                selectedUnits.forEach((unitId: number) => {
                    // addComponent(world, Command, unitId)
                    const cmdId = addEntity(world)
                    addComponent(world, Command, cmdId)
                    Command.type[cmdId] = CommandType.GOTO
                    Command.targetX[cmdId] = x
                    Command.targetY[cmdId] = y
                    Commandable.commands[unitId][0] = cmdId
                })
                return;
            }

            // Left click
            switch (mouseStatus) {
                case InputMouseStatus.mouseStatus.SINGLE_CLICK:
                    select()
                    EventDispatcher.getInstance().emit(MouseClickedEvent.name, new MouseClickedEvent(MouseButtons.left, x, y))
                    break;
                case InputMouseStatus.mouseStatus.DOUBLE_CLICK:
                    selectType()
                    EventDispatcher.getInstance().emit(MouseClickedEvent.name, new MouseClickedEvent(MouseButtons.left, x, y, ClickType.double))
                    break;
                case InputMouseStatus.mouseStatus.DRAG:
                    selectRectangle();
                    break;
                // This 2 mouse statuses allow us to click once on the icon,
                //and drop it later with another click
                // case PLACE_BUILDING: startBuilding(); break;
                // case CLICK_BUILDING: mouseStatus = PLACE_BUILDING; break;
                default:
                    console.error("no handled MouseStatus: " + mouseStatus)
            }
            if (mouseStatus != InputMouseStatus.mouseStatus.PLACE_BUILDING) mouseStatus = InputMouseStatus.mouseStatus.NONE;

        })

        scene.input.on("pointerdown", inputDown)
        scene.input.on('pointermove', mouseDragMove);

        //prevent right click on canvas
        game.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };

        dragRect = new Phaser.Geom.Rectangle(0, 0, 0, 0)
    }

    function render() {
        graphics.clear()
        graphics.strokeRectShape(dragRect)
    }

    create()
    return defineSystem((world) => {
        render()

        return world
    })
}
