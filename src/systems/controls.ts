import Phaser from 'phaser'
import {defineQuery, defineSystem, IWorld,} from 'bitecs'

import Input from '../components/Input'
import {Utils} from "./utils";
import Position from '../components/Position'
import Player from "../components/Player";
import {EventDispatcher} from "../events/EventDispatcher";
import SelectUnits from '../events/SelectUnits'
import UnitsSelected from "../events/UnitsSelected";
import MouseClickedEvent, {ClickType, MouseButtons} from "../events/MouseClickedEvent";

export default function createControlSystem(scene: Phaser.Scene, game: Phaser.Game, world: IWorld) {

    let cursors: { left: { isDown: any }; right: { isDown: any }; up: { isDown: any }; down: { isDown: any } }; //keyboard

    const CAMERA_SPEED = 10;

    const DOUBLE_CLICK_TIME = 300;

    const SINGLE_CLICK = "single_click";
    const DOUBLE_CLICK = "double_click";
    const DRAG = "drag";
    const NONE = "none";
    const CLICK_BUILDING = "click_building";
    const PLACE_BUILDING = "place_building";

    let mouseStatus = NONE;
    let clickStart: { x: number; y: number };
    let clickTime: number;

    let dragRect: Phaser.Geom.Rectangle;
    let overrideMove = false;

    //Building stuff
    let building: Phaser.GameObjects.Sprite; //Placeholder for building

    let PLAYER_ID: number

    let graphics: Phaser.GameObjects.Graphics

    function setDragRect(x: number, y: number, w: number, h: number) {
        dragRect.x = x;
        dragRect.y = y;
        dragRect.width = w;
        dragRect.height = h;
    }



    function selectRectangle() {
        //Select all units in the drag-rectangle area
        const selected: Uint8Array[] = [];
        //  Global.selectedUnits[Global.myPlayer] = [];
        console.log("Select rectangle " + dragRect.x + "," + dragRect.y + ", " + dragRect.width + "," + dragRect.height)

        Utils.myUnits(PLAYER_ID, world).forEach(function (unit: number) {
            // @ts-ignore
            EventDispatcher.getInstance().emit(SelectUnits.name, this,{ids: selected})
            if (Phaser.Geom.Rectangle.Contains(dragRect, Position.x[unit], Position.y[unit])) {
                selected.push(Uint8Array.from([unit]))
            }
            // @ts-ignore
            EventDispatcher.getInstance().emit(UnitsSelected.name, {ids: selected})
        });
        if (selected.length > 0) { // @ts-ignore
            Player.selectedUnits[PLAYER_ID] = selected;
        }
        // dragRect.width = 0;
        scene.time.addEvent({
            delay: 150, callback: function () {
                setDragRect(0,0,0,0)
            }
        })

        console.log("selected units ", selected)

        return selected; // used in Select
    }

    function select() {
        // Create tiny rectangle and use selectRectangle method
        const unitSize = 1;

        //Create tiny rectangle to see if a unit is inside
        setDragRect(game.input.activePointer.worldX - unitSize / 2, game.input.activePointer.worldY - unitSize / 2, unitSize, unitSize);
        const selected = selectRectangle();
        //If select rectangle returns more than 1, select only the first one
        if (selected.length > 0) Player.selectedUnits[PLAYER_ID] = selected[0]
        return selected[0]; //Used in selectType
    }

    function selectType() {
        /*First, we select one unit with select() method,
          then we select all the other units with the same type
          Only capture those included in the camera
          */
        const selected = select();
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
            setDragRect(0,0,0,0)
            // dragRect.width = 0;
        }
    }

    function inputDown() {
        if (scene.input.activePointer.rightButtonDown()) return;
        if (mouseStatus != NONE) return;
        // Copy x and y values from mousepointer
        clickStart = {x: game.input.activePointer.worldX, y: game.input.activePointer.worldY};
        //console.log("Time since last click " , game.time.now - clickTime);
        if (scene.time.now - clickTime < DOUBLE_CLICK_TIME) mouseStatus = DOUBLE_CLICK;
        else mouseStatus = SINGLE_CLICK;

        clickTime = scene.time.now;

        // Debug walkables tile

        // const xy = Global.level.worldToTile(game.input.activePointer.worldX, game.input.activePointer.worldY);
        // const tile = Global.map.getTile(xy[0], xy[1]);
        // if (Global.walkables.indexOf(tile.index) == -1)   console.log("Non walkable tile ", tile.index);
    }

    function mouseDragMove() {
        if (mouseStatus == PLACE_BUILDING || mouseStatus == CLICK_BUILDING) {
            building.x = game.input.activePointer.worldX;
            building.y = game.input.activePointer.worldY;
        } else if (mouseStatus != NONE) {
            //Not actual distance, but simpler formula
            const distance = Math.abs(clickStart.x - game.input.mousePointer.x) +
                Math.abs(clickStart.y - game.input.mousePointer.y);

            if (distance > 20 && scene.time.now - clickTime > 100) {
                mouseStatus = DRAG;
                setDragRect(Math.min(game.input.activePointer.worldX, clickStart.x),
                    Math.min(game.input.activePointer.worldY, clickStart.y),
                    Math.abs(game.input.activePointer.worldX - clickStart.x),
                    Math.abs(game.input.activePointer.worldY - clickStart.y));
            }
        }
    }

    function create() {
        graphics = scene.add.graphics({lineStyle: {width: 1, color: 0xff000033}});
        cursors = scene.input.keyboard.createCursorKeys();

        scene.input.on("pointerup", function () {
            const x = game.input.activePointer.worldX //clickStart.x
            const y = game.input.activePointer.worldY
            const elapsed = scene.time.now - clickTime;
            // Right click
            if (scene.input.activePointer.rightButtonReleased()) {
                EventDispatcher.getInstance().emit(MouseClickedEvent.name, new MouseClickedEvent(MouseButtons.right, x, y))
                return;
            }

            // Left click
            switch (mouseStatus) {
                case SINGLE_CLICK:
                    select();
                    EventDispatcher.getInstance().emit(MouseClickedEvent.name, new MouseClickedEvent(MouseButtons.left, x, y))
                    break;
                case DOUBLE_CLICK:
                    selectType()
                    EventDispatcher.getInstance().emit(MouseClickedEvent.name, new MouseClickedEvent(MouseButtons.left, x, y, ClickType.double))
                    break;
                case DRAG:
                    selectRectangle();
                    break;
                // This 2 mouse statuses allow us to click once on the icon,
                //and drop it later with another click
                // case PLACE_BUILDING: startBuilding(); break;
                // case CLICK_BUILDING: mouseStatus = PLACE_BUILDING; break;
                default:
                    console.error("no handled MouseStatus: " + mouseStatus)
            }
            if (mouseStatus != PLACE_BUILDING) mouseStatus = NONE;

        })

        scene.input.on("pointerdown", inputDown)
        scene.input.on('pointermove', mouseDragMove);

        //prevent right click on canvas
        game.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };


        dragRect = new Phaser.Geom.Rectangle(0, 0, 0, 0)

        building = scene.add.sprite(0, 0, 'castle-rock');
        building.alpha = 0;
        building.width = 48;
        building.height = 48;
        //TODO
        //building.anchor.setTo(0.5, 0.5);
    }

    // function update(){
    // 	if (cursors.left.isDown)  scene.cameras.default.x -= CAMERA_SPEED;
    // 	if (cursors.right.isDown)  scene.cameras.default.x += CAMERA_SPEED;
    // 	if (cursors.up.isDown)  scene.cameras.default.y -= CAMERA_SPEED;
    // 	if (cursors.down.isDown)  scene.cameras.default.y += CAMERA_SPEED;
    // }

    function render() {
        graphics.clear();

        // for(let i = 0; i < points.length; i++)
        // {
        //     const p = points[i];
        //
        //     if (Array.isArray(p))
        //     {
        //         graphics.fillCircle(p[0], p[1], 4);
        //     }
        //     else
        //     {
        //         graphics.fillCircle(p.x, p.y, 4);
        //     }
        // }

        graphics.strokeRectShape(dragRect);
        // scene.game.debug.geom(dragRect, 'rgba(0, 200,0,0.2)');
    }

    //TODO
    // function clickBuilding(sprite){ //event given as argument in HUD
    // 	const type = sprite.type;
    // 	if (Global.resources[PLAYER_ID][type] < BUILDING_COST) {
    // 		Dialog.new(150, game.height - 10,"Not enough resources", 1000);
    // 		return;
    // 	}
    // 	const selectedUnitType = utils.mySelectedUnits(type);
    // 	if (selectedUnitType.length === 0){
    // 		Dialog.new(150, game.height - 10,"Select unit first ", 1000);
    // 		return;
    // 	}
    //
    // 	mouseStatus= CLICK_BUILDING;
    // 	building.key = 'castle-'+typeToName(type);
    // 	building.x = game.input.activePointer.worldX;
    // 	building.y = game.input.activePointer.worldY;
    // 	building.type = type;
    // 	building.alpha = 1;
    // 	//  doNotMove();
    // }


    const cpuQuery = defineQuery([Input])


    create()


    return defineSystem((world) => {
        const entities = cpuQuery(world)

        const dt = scene.game.loop.delta
        render()

        return world
    })
}
