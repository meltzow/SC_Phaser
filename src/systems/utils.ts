import {defineQuery, IWorld} from "bitecs";
import CPU from "../components/CPU";
import Velocity from "../components/Velocity";
import Rotation from "../components/Rotation";
import Input from "../components/Input";
import {PAPER, ROCK, SCISSOR} from "../components/Game";
import Position from "../components/Position";
import Selectable from "../components/Selectable";
import Player from "../components/Player";
import Unit from "../components/Unit";

export class Utils {

    // ------------
    // PRIVATE VARIABLES
    // ---------------
    static progressRender = [];
    static levelResources: [[],[],[]]

    //Globally accessible variables (static)
    static UNIT_TYPES = 3;

    // Used on image names and stuff
    static typeToName (type: number){
        var array = ['rock', 'paper', 'scissor'];
        return array[type];
    }

    BUILDING_COST =  10; //Used in both controls and unit
    UNIT_COST = 5;

    PLAYER_ID = 0; // Human player ID
    //globalDefaults =  JSON.stringify(Global)// Copy by value

    // ------------
    // PRIVATE METHODS
    // ---------------
    static flatten(arrayOfArrays: string | any[]) {
        let array: any[] = [];
        for (let i = 0; i < arrayOfArrays.length; i++){
            array = array.concat( arrayOfArrays[i]);
        }
        return array;
    }

    static enemyObjects(playerId: number, listObjects: any[]) {
        let objects: any[] = [];
        const enemyPlayerIds = Player.enemyPlayerIds[playerId];
        for (let i = 0; i < Global.units.length; i++){ //loop number players
            if (enemyPlayerIds.indexOf(i) != -1) {
                objects = objects.concat(listObjects[i]); //Player i objecs
            }
        }
        return objects;
    }

    public static allUnits() {
        return defineQuery([CPU, Velocity, Rotation, Input])
    }

//     static allResources() : Array<number>{
// return
//     }

    static random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static randomArray(array: string | any[]) {
        if (array.length > 0) {
            const r = this.random(0, array.length - 1);
            return array[r];
        }
    }

    static spiral(pos: number) {
        //Solution http://stackoverflow.com/a/14010215
        //Another solution http://stackoverflow.com/questions/398299/looping-in-a-spiral
        let x = 0, y = 0, dx = 0, dy = -1;
        let leg = 0, layer = 1;
        for (let i = 0; i < pos; i++) {
            switch (leg) {
                case 0:
                    x++;
                    if (x == layer) leg++;
                    break;
                case 1:
                    y++;
                    if (y == layer) leg++;
                    break;
                case 2:
                    x--;
                    if (-x == layer) leg++;
                    break;
                case 3:
                    y--;
                    if (-y == layer) {
                        leg = 0;
                        layer++;
                    }
                    break;
            }
        }
        return [x, y];
    }

    static distance(sprite1: { x: number; y: number; }, sprite2: { x: number; y: number; }) {
        //  console.log("SPrite 1, ",sprite1, sprite2);
        return Math.sqrt(Math.pow(sprite1.x - sprite2.x, 2) +
            Math.pow(sprite1.y - sprite2.y, 2));
    }

    static closest(sprite: { x: number; y: number; }, sprites: string | any[]) {
        let closestSprite, closestDistance;
        for (let i = 0; i < sprites.length; i++) {
            const s = sprites[i];
            const distance = this.distance(sprite, s.properties());
            //  console.log("Distance between, ", sprite, s.properties(), distance);
            // @ts-ignore
            if (!closestSprite || distance < closestDistance) {
                closestDistance = distance;
                closestSprite = s;
            }
        }
        return closestSprite;
    }

    static myUnits(myPlayer: number, world: IWorld) :number[]{
        const myUnitsQuery = defineQuery([Position, Selectable, Unit])

        const ids = myUnitsQuery(world)
        for (const id in ids) {

        }
        return ids
    }

    static mySelectedUnits(type: number, world: IWorld) :number[]{
        //FIXME: selectable means not selected
        const myUnitsQuery = defineQuery([Position, Selectable, Unit])

        const ids = myUnitsQuery(world)
        for (const id in ids) {

        }
        return ids
    }

    // static buildings(playerId: string | number, type: any) {
    //     function filterByType(object) {
    //         return object.properties().type === type;
    //     }
    //     return Global.buildings[playerId].filter(filterByType);
    // }
    //
    // static allBuildings() {
    //     return flatten(Global.buildings);
    // }

    // static getResource(id: any) {
    //     const allResources = this.allResources();
    //     for (let j = 0; j < allResources.length; j++) {
    //         const r = allResources[j];
    //         if (id == r.properties().id) return r;
    //     }
    //     return undefined;
    // }

    static allies(myPlayer: number) {
        let units: any[] = [];
        const enemyPlayerIds = Player.enemyPlayerIds[myPlayer];
        for (let i = 0; i < Global.units.length; i++) {
            if (enemyPlayerIds.indexOf(i) == -1 && i != myPlayer) {
                const playerUnits = Global.units[i]; //Player i units
                units = units.concat(playerUnits);
            }
        }
        return units;
    }

    static enemies(playerId: any) {
        return Utils.enemyObjects(playerId, Global.units);
    }

    // static enemyBuildings(playerId: any) {
    //     return Utils.enemyObjects(playerId, Global.buildings);
    // }

    // static removeUnit(id: any, playerId: number) {
    //     const filterById = function (unit) {
    //         return unit.properties().id != id;
    //     };
    //
    //     //  console.log("Removing id " + id + " from player "+playerId+": " + Global.units[playerId].length);
    //     Global.units[playerId] = Global.units[playerId].filter(filterById);
    //     Player.selectedUnits[playerId] = Player.selectedUnits[playerId].filter(filterById);
    //     //console.log("Total units ", Global.units[playerId].length);
    // }

    // static removeBuilding(id: any, playerId: string | number) {
    //     const filterById = function (building: { properties: () => { (): any; new(): any; id: any; }; }) {
    //         return building.properties().id != id;
    //     };
    //
    //     Global.buildings[playerId] = Global.buildings[playerId].filter(filterById);
    // }

//Change color depending on player ID
    static tintSprite(sprite: { tint: number; }, type: number) {
        switch (type) {
            case 0:
                sprite.tint = 0xaaffaa;
                break;
            case 1:
                sprite.tint = 0xffaaaa;
                break;
            case 2:
                sprite.tint = 0xaaaaff;
                break;
            case 3:
                sprite.tint = 0xffaaff;
                break;

            default:
                console.error("Undefined player id " + type);
        }
    }

    static onUnitInArea(x: any, y: any, w: any, h: any, callback: (arg0: any) => void/*unit*/, autodestroy: boolean) {
        //IF any of my player units are inside an area
        if (typeof autodestroy === 'undefined') autodestroy = true;

        const checkTimer = Global.game.time.create(true);
        const rect = new Phaser.Geom.Rectangle(x, y, w, h);
        checkTimer.loop(1000, function () {
            for (let i = 0; i < Global.selectedUnits[milliseconds].length; i++) {
                const unit = Player.selectedUnits[PLAYER_ID][i];
                if (rect.contains(unit.properties().x, unit.properties().y)) {
                    console.log("Unit in area ", autodestroy);
                    if (autodestroy) checkTimer.destroy();
                    callback(unit);
                    return;
                }
            }
        });
        checkTimer.start();
    }

    static damage(attackType: any, defenseType: any) {
        let damage = 2; //default (must be multiple of 2)
        //TODO type vars
        if (defenseType === ROCK && attackType == PAPER) damage *= 2;
        else if (defenseType == PAPER && attackType == SCISSOR) damage *= 2;
        else if (defenseType == SCISSOR && attackType === ROCK) damage *= 2;

        else if (defenseType == PAPER && attackType === ROCK) damage /= 2;
        else if (defenseType == SCISSOR && attackType == PAPER) damage /= 2;
        else if (defenseType === ROCK && attackType == SCISSOR) damage /= 2;

        return damage;
    }

    static textButton(x: number, y: any, text: any, callback: any) {
        const game = Global.game;
        const style = {font: "32px Arial", fill: "#ff0000", boundsAlignH: "center", boundsAlignV: "middle"};
        const buttonWidth = 200;
        const buttonHeight = 50;
        const button = game.add.button(x - buttonWidth / 2, y, 'button', callback);
        button.width = buttonWidth;
        button.height = buttonHeight;
        const t = game.add.text(x, y, text, style);
        t.setTextBounds(-buttonWidth / 2, 10, buttonWidth, buttonHeight); //Center text in button
    }

    static progressBar(x: number | undefined, y: number | undefined, miliseconds: number) {
        const width = 32;
        const height = 10;
        const rect = new Phaser.Geom.Rectangle(x, y, 0, height);
        const background = new Phaser.Geom.Rectangle(x, y, width, height);
        Utils.progressRender.push({rect: rect, background: background});

        const steps = 10;
        Global.game.time.events.repeat(miliseconds / steps, steps, function () {
            rect.width += width / steps;
            background.x = rect.right;
            background.width = width - rect.width;
            //TODO remove from array too
        });
    }

    // static resetLevel(levelName: string) {
    //     if (levelName) Global.levelName = levelName;
    //     // Reset globals
    //     const defaultSettings = JSON.parse(globalDefaults);
    //     Object.keys(defaultSettings).forEach(function (key) {
    //         Global[key] = defaultSettings[key];
    //     });
    //
    //     Global.game.state.start('level');
    // }

    static render() {
        const game = Global.game;

        //console.log("progressRender ", progressRender);
        Utils.progressRender.forEach(function (progress: { background: { width: number; }; rect: any; }) {
            if (progress.background.width > 0.1) {
                //console.log("progress.background.width", progress.background.width);
                game.debug.geom(progress.rect, 'rgba(117,213,255,0.5)');
                game.debug.geom(progress.background, 'rgba(23, 74,151,0.5)');
            }
        });
    }
}
