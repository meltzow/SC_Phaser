import Phaser from 'phaser';
import {Skeleton} from "./Skeleton";
import {Zergling} from "./Zergling";

var skeletons: Skeleton[] = [];
var zerglings: Zergling[] = [];

var tileWidthHalf;
var tileHeightHalf;

var d = 0;

export default class Example extends Phaser.Scene
{
  constructor ()
  {
    super('');
  }

  preload ()
  {
    this.load.json('map', 'assets/iso/isometric-grass-and-water.json');
    this.load.spritesheet('tiles', 'assets/iso/isometric-grass-and-water.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('skeleton', 'assets/iso/skeleton8.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('zergling', 'assets/Charas/Zergling.png', { frameWidth: 43, frameHeight: 42 });
    this.load.image('house', 'assets/iso/rem_0002.png');
  }

  create ()
  {
    this.buildMap();
    this.placeHouses();

    skeletons.push(this.add.existing(new Skeleton(this, 240, 290, 'walk', 'southEast', 100)));
    skeletons.push(this.add.existing(new Skeleton(this, 100, 380, 'walk', 'southEast', 230)));
    skeletons.push(this.add.existing(new Skeleton(this, 620, 140, 'walk', 'south', 380)));
    skeletons.push(this.add.existing(new Skeleton(this, 460, 180, 'idle', 'south', 0)));
    zerglings.push(this.add.existing(new Zergling(this, 120, 300, 'walk', 'north', 200)));


    this.cameras.main.setSize(1600, 600);

    // this.cameras.main.scrollX = 800;
  }

  update ()
  {
    skeletons.forEach(function (skeleton) {
      skeleton.update();
    });

    zerglings.forEach(function (zergling) {
      zergling.update();
    });


  }


  buildMap ()
  {
    //  Parse the data out of the map
    const data = this.cache.json.get('map');

    const tilewidth = data.tilewidth;
    const tileheight = data.tileheight;

    tileWidthHalf = tilewidth / 2;
    tileHeightHalf = tileheight / 2;

    const layer = data.layers[0].data;

    const mapwidth = data.layers[0].width;
    const mapheight = data.layers[0].height;

    const centerX = mapwidth * tileWidthHalf;
    const centerY = 16;

    let i = 0;

    for (let y = 0; y < mapheight; y++)
    {
      for (let x = 0; x < mapwidth; x++)
      {
        const id = layer[i] - 1;

        const tx = (x - y) * tileWidthHalf;
        const ty = (x + y) * tileHeightHalf;

        const tile = this.add.image(centerX + tx, centerY + ty, 'tiles', id);

        tile.depth = centerY + ty;

        i++;
      }
    }
  }

  placeHouses ()
  {
    const house_1 = this.add.image(240, 370, 'house');
    house_1.depth = house_1.y + 86;

    const house_2 = this.add.image(1300, 290, 'house');
    house_2.depth = house_2.y + 86;
  }
}
