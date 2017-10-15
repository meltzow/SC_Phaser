import {BaseSystem} from "./BaseSystem";
import {EventBus} from "../events/EventBus";
import * as Asset from "../components/Asset";
import {Player} from "../components/Player";
import {EntityUtils} from "../entities/EntityUtils";
import {Entity} from "../entities/Entity";

export class AssetSystem extends BaseSystem {


    constructor() {
        super([Asset.Asset, Asset.Animation]);
      }

    created() {
        var entities = EntityUtils.findEntities(Asset.Animation);
        entities.forEach((entity: Entity) => {
            var overloard = entity.get(Asset.Asset)
            //overloard.animations
            /*this.player.animations.add('southeast', [64, 65, 66, 67], 6, true);
        this.player.animations.add('south', [52, 53, 54, 55], 6, true);
        this.player.animations.add('southwest', [36, 37, 38, 39], 6, true);
        this.player.animations.add('west', [20, 21, 22, 23], 6, true);
        this.player.animations.add('northwest', [0, 1, 2, 3], 6, true);
        this.player.animations.add('north', [16, 17, 18, 19], 6, true);
        this.player.animations.add('northeast', [32, 33, 34, 35], 6, true);
        this.player.animations.add('east', [48, 49, 50, 51], 6, true);*/
        })
    }

}