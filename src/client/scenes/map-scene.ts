
class Skeleton1 extends Phaser.GameObjects.Image {

}

export class MapScene extends Phaser.Scene {

  

  public directions = {
    west: { offset: 0, x: -2, y: 0, opposite: 'east' },
    northWest: { offset: 32, x: -2, y: -1, opposite: 'southEast' },
    north: { offset: 64, x: 0, y: -2, opposite: 'south' },
    northEast: { offset: 96, x: 2, y: -1, opposite: 'southWest' },
    east: { offset: 128, x: 2, y: 0, opposite: 'west' },
    southEast: { offset: 160, x: 2, y: 1, opposite: 'northWest' },
    south: { offset: 192, x: 0, y: 2, opposite: 'north' },
    southWest: { offset: 224, x: -2, y: 1, opposite: 'northEast' }
};

anims = {
    idle: {
        startFrame: 0,
        endFrame: 4,
        speed: 0.2
    },
    walk: {
        startFrame: 4,
        endFrame: 12,
        speed: 0.15
    },
    attack: {
        startFrame: 12,
        endFrame: 20,
        speed: 0.11
    },
    die: {
        startFrame: 20,
        endFrame: 28,
        speed: 0.2
    },
    shoot: {
        startFrame: 28,
        endFrame: 32,
        speed: 0.1
    }
};

private skeletons: any = [];

private tileWidthHalf: any;
private tileHeightHalf: any;

private d = 0;

private scene: any;

preload ()
{
    this.load.json('map', 'assets/tests/iso/isometric-grass-and-water.json');
    this.load.spritesheet('tiles', 'assets/tests/iso/isometric-grass-and-water.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('skeleton', 'assets/tests/iso/skeleton8.png', { frameWidth: 128, frameHeight: 128 });
    this.load.image('house', 'assets/tests/iso/rem_0002.png');
}

create ()
{
    this.scene = this;

    //  Our Skeleton class

    var Skeleton = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize: 

        function Skeleton (scene, x, y, motion, direction, distance)
        {
            this.startX = x;
            this.startY = y;
            this.distance = distance;

            this.motion = motion;
            this.anim = anims[motion];
            this.direction = directions[direction];
            this.speed = 0.15;
            this.f = this.anim.startFrame;

            Phaser.GameObjects.Image.call(this, scene, x, y, 'skeleton', this.direction.offset + this.f);

            this.depth = y + 64;

            scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
        },

        changeFrame: function ()
        {
            this.f++;

            var delay = this.anim.speed;

            if (this.f === this.anim.endFrame)
            {
                switch (this.motion)
                {
                    case 'walk':
                        this.f = this.anim.startFrame;
                        this.frame = this.texture.get(this.direction.offset + this.f);
                        scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
                        break;

                    case 'attack':
                        delay = Math.random() * 2;
                        scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                        break;

                    case 'idle':
                        delay = 0.5 + Math.random();
                        scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                        break;

                    case 'die':
                        delay = 6 + Math.random() * 6;
                        scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                        break;
                }
            }
            else
            {
                this.frame = this.texture.get(this.direction.offset + this.f);

                scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
            }
        },

        resetAnimation: function ()
        {
            this.f = this.anim.startFrame;

            this.frame = this.texture.get(this.direction.offset + this.f);

            scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
        },

        update: function ()
        {
            if (this.motion === 'walk')
            {
                this.x += this.direction.x * this.speed;

                if (this.direction.y !== 0)
                {
                    this.y += this.direction.y * this.speed;
                    this.depth = this.y + 64;
                }

                //  Walked far enough?
                if (Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y) >= this.distance)
                {
                    this.direction = directions[this.direction.opposite];
                    this.f = this.anim.startFrame;
                    this.frame = this.texture.get(this.direction.offset + this.f);
                    this.startX = this.x;
                    this.startY = this.y;
                }
            }
        }

    });

    this.buildMap();
    this.placeHouses();

    this.skeletons.push(this.add.existing(new Skeleton(this, 240, 290, 'walk', 'southEast', 100)));
    this.skeletons.push(this.add.existing(new Skeleton(this, 100, 380, 'walk', 'southEast', 230)));
    this.skeletons.push(this.add.existing(new Skeleton(this, 620, 140, 'walk', 'south', 380)));
    this.skeletons.push(this.add.existing(new Skeleton(this, 460, 180, 'idle', 'south', 0)));

    this.skeletons.push(this.add.existing(new Skeleton(this, 760, 100, 'attack', 'southEast', 0)));
    this.skeletons.push(this.add.existing(new Skeleton(this, 800, 140, 'attack', 'northWest', 0)));

    this.skeletons.push(this.add.existing(new Skeleton(this, 750, 480, 'walk', 'east', 200)));

    this.skeletons.push(this.add.existing(new Skeleton(this, 1030, 300, 'die', 'west', 0)));

    this.skeletons.push(this.add.existing(new Skeleton(this, 1180, 340, 'attack', 'northEast', 0)));

    this.skeletons.push(this.add.existing(new Skeleton(this, 1180, 180, 'walk', 'southEast', 160)));

    this.skeletons.push(this.add.existing(new Skeleton(this, 1450, 320, 'walk', 'southWest', 320)));
    this.skeletons.push(this.add.existing(new Skeleton(this, 1500, 340, 'walk', 'southWest', 340)));
    this.skeletons.push(this.add.existing(new Skeleton(this, 1550, 360, 'walk', 'southWest', 330)));

    this.cameras.main.setSize(1600, 600);

    // this.cameras.main.scrollX = 800;
}

buildMap ()
{
    //  Parse the data out of the map
    var data = this.scene.cache.json.get('map');

    var tilewidth = data.tilewidth;
    var tileheight = data.tileheight;

    this.tileWidthHalf = tilewidth / 2;
    this.tileHeightHalf = tileheight / 2;

    var layer = data.layers[0].data;

    var mapwidth = data.layers[0].width;
    var mapheight = data.layers[0].height;

    var centerX = mapwidth * this.tileWidthHalf;
    var centerY = 16;

    var i = 0;

    for (var y = 0; y < mapheight; y++)
    {
        for (var x = 0; x < mapwidth; x++)
        {
            var id = layer[i] - 1;

            var tx = (x - y) * this.tileWidthHalf;
            var ty = (x + y) * this.tileHeightHalf;

            var tile = this.scene.add.image(centerX + tx, centerY + ty, 'tiles', id);

            tile.depth = centerY + ty;

            i++;
        }
    }
}

placeHouses ()
{
    var house = this.scene.add.image(240, 370, 'house');

    house.depth = house.y + 86;

    house = this.scene.add.image(1300, 290, 'house');

    house.depth = house.y + 86;
}

update ()
{
    this.skeletons.forEach(function (skeleton: any) {
        skeleton.update();
    });

    // return;

    if (this.d)
    {
        this.cameras.main.scrollX -= 0.5;

        if (this.cameras.main.scrollX <= 0)
        {
            this.d = 0;
        }
    }
    else
    {
        this.cameras.main.scrollX += 0.5;

        if (this.cameras.main.scrollX >= 800)
        {
            this.d = 1;
        }
    }
}
  }