import * as Assets from '../assets';
import { ScreenUtils } from '../utils/utils';

export default class InGame extends Phaser.State {
    private entities: Array<Object> = [];
    private nextEntityId: 0;
    private mummySpritesheet: Phaser.Sprite = null;

    // x & y values of the direction vector for character movement
    //dX = 0;
    //dY = 0;
    tileWidth = 50; // the width of a tile
    borderOffset = new Phaser.Point(250, 50); // to centralise the isometric level display
    wallGraphicHeight = 98;
    floorGraphicWidth = 103;
    floorGraphicHeight = 53;
    heroGraphicWidth = 84;
    heroGraphicHeight = 84;
    facing = 'south';//direction the character faces
    gameScene;//this is the render texture onto which we draw depth sorted scene
    wallSprite;
    heroMapTile;//hero tile values in array
    heroMapPos;//2D coordinates of hero map marker sprite in minimap, assume this is mid point of graphic
    heroSpeed = 50;//well, speed of our hero
    levelData = [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 1],
        [1, 0, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1]];

    isoGroup: Phaser.Group;
    cursors: Phaser.CursorKeys;
    player: Phaser.Plugin.Isometric.IsoSprite;

    preload() {
        //load all necessary assets
        this.game.load.bitmapFont('font', Assets.BitmapFonts.Font.getPNG(), Assets.BitmapFonts.Font.getXML());
        this.game.load.image('greenTile', Assets.Images.GreenTile.getPNG());
        this.game.load.image('redTile', Assets.Images.RedTile.getPNG());
        this.game.load.image('heroTile', Assets.Images.HeroTile.getPNG());
        this.game.load.image('heroShadow', Assets.Images.BallShadow.getPNG());
        this.game.load.image('floor', Assets.Images.Floor.getPNG());
        this.game.load.image('wall', Assets.Images.Block.getPNG());
        this.game.load.image('ball', Assets.Images.Ball.getPNG());
        this.game.load.atlasJSONArray('hero', Assets.Atlases.Hero844162.getPNG(), Assets.Atlases.Hero844162.getJSONArray());


        this.game.plugins.add(Phaser.Plugin.Isometric);
        // Start the IsoArcade physics system.
        this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
    }

    public create(): void {
        let map = {
            visual: {
                image: Assets.Spritesheets.SpritesheetsOverlord848472
            },
            data: [
                [1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1]
            ]
        };
        let overlord = {
            visual: {
                image: Assets.Spritesheets.SpritesheetsOverlord848472
            }
        };
        this.entities.push(map);
        this.entities.push(overlord);

        //this.mummySpritesheet = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 175, Assets.Spritesheets.SpritesheetsOverlord848472.getName());
        //this.mummySpritesheet.animations.add('walk', [32, 33, 34, 35]);
        //this.mummySpritesheet.animations.play('walk', 10, true);

        /* this.bmpText = this.game.add.bitmapText(10, 10, 'font', 'Isometric Tutorial', 18);
         this.normText = this.game.add.text(10, 360, 'hi');
         this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
         this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
         this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
         this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
         this.game.stage.backgroundColor = '#cccccc';
         //we draw the depth sorted scene into this render texture
         this.gameScene = this.game.add.renderTexture(this.game.width, this.game.height);
         this.game.add.sprite(0, 0, this.gameScene);
         this.floorSprite = this.game.make.sprite(0, 0, 'floor');
         this.wallSprite = this.game.make.sprite(0, 0, 'wall');
         this.sorcererShadow = this.game.make.sprite(0, 0, 'heroShadow');
         this.sorcererShadow.scale = new Phaser.Point(0.5, 0.6);
         this.sorcererShadow.alpha = 0.4;
         this.createLevel();
         */

        //this.game.plugins.add((Phaser.Plugin as any).Isometric);
        //(this.game as any).iso.anchor.setTo(0.5, 0.2);

        // Create a group for our tiles.
        this.isoGroup = this.game.add.group();


        // Set the global gravity for IsoArcade.
        this.game.physics.isoArcade.gravity.setTo(0, 0, -500);

        // Let's make a load of tiles on a grid.
        this.spawnTiles();

        // Create another cube as our 'player', and set it up just like the cubes above.
        this.player = (this.game.add as any).isoSprite(128, 128, 0, Assets.Spritesheets.SpritesheetsOverlord848472.getName(), 0, this.isoGroup);
        this.player.tint = 0x86bfda;
        this.player.anchor.set(0.5);
        this.game.physics.isoArcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

        // Set up our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);

        // animation
        this.player.animations.add('southeast', [64, 65, 66, 67], 6, true);
        this.player.animations.add('south', [52, 53, 54, 55], 6, true);
        this.player.animations.add('southwest', [36, 37, 38, 39], 6, true);
        this.player.animations.add('west', [20, 21, 22, 23], 6, true);
        this.player.animations.add('northwest', [0, 1, 2, 3], 6, true);
        this.player.animations.add('north', [16, 17, 18, 19], 6, true);
        this.player.animations.add('northeast', [32, 33, 34, 35], 6, true);
        this.player.animations.add('east', [48, 49, 50, 51], 6, true);
    }

    spawnTiles() {
        var tile;
        for (var xx = 0; xx < 256; xx += 38) {
            for (var yy = 0; yy < 256; yy += 38) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                tile = (this.game.add as any).isoSprite(xx, yy, 0, 'tile', 0, this.isoGroup);
                tile.anchor.set(0.5, 0);
            }
        }
    }

    update() {
        //if no key is pressed then stop else play walking animation
        if (this.player.body.velocity.y == 0 && this.player.body.velocity.x == 0) {
            this.player.animations.stop();
            this.player.animations.currentAnim.frame = 0;
        } else {
            if (this.player.animations.currentAnim.name != this.facing) {
                this.player.animations.play(this.facing);
            }
        }
        // Move the player at this speed.
        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -this.heroSpeed;
        }
        else if (this.cursors.down.isDown) {
            this.player.body.velocity.y = this.heroSpeed;
        }
        else {
            this.player.body.velocity.y = 0;
        }

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -this.heroSpeed;
            if (this.player.body.velocity.y == 0) {
                this.facing = "west";
            }
            else if (this.player.body.velocity.y > 0) {
                this.facing = "southwest";
            } else {
                this.facing = "northwest";
            }
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = this.heroSpeed;
            if (this.player.body.velocity.y == 0) {
                this.facing = "east";
            }
            else if (this.player.body.velocity.y > 0) {
                this.facing = "southeast";
            }
            else {
                this.facing = "northeast";
            }
        }
        else {
            this.player.body.velocity.x = 0;
            if (this.player.body.velocity.y == 0) {
                this.facing = "west";
            }
            else if (this.player.body.velocity.y > 0) {
                this.facing = "south";
            } else {
                this.facing = "north";
            }
        }

        // Our collision and sorting code again.
        // this.game.physics.isoArcade.collide(this.isoGroup);
        //this.game.iso.topologicalSort(isoGroup);
    }


}
