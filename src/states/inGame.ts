import * as Assets from '../assets';
import * as Chk from 'bw-chk';
import { ScreenUtils } from '../utils/utils';

export default class InGame extends Phaser.State {
    private entities: Array<Object> = [];
    private nextEntityId: 0;
    private mummySpritesheet: Phaser.Sprite = null;

    upKey;
    downKey;
    leftKey;
    rightKey;
    // x & y values of the direction vector for character movement
    dX = 0;
    dY = 0;
    tileWidth = 50; // the width of a tile
    borderOffset = new Phaser.Point(250, 50); // to centralise the isometric level display
    wallGraphicHeight = 98;
    floorGraphicWidth = 103;
    floorGraphicHeight = 53;
    heroGraphicWidth = 84;
    heroGraphicHeight = 84;
    wallHeight = this.wallGraphicHeight - this.floorGraphicHeight;
    heroHeight = (this.floorGraphicHeight / 2) + (this.heroGraphicHeight - this.floorGraphicHeight) + 6;//adjustments to make the legs hit the middle of the tile for initial load
    heroWidth = (this.floorGraphicWidth / 2) - (this.heroGraphicWidth / 2);//for placing hero at the middle of the tile
    facing = 'south';//direction the character faces
    sorcerer;//hero
    sorcererShadow;//duh
    shadowOffset = new Phaser.Point(this.heroWidth + 7, 11);
    bmpText;//title text
    normText;//text to display hero coordinates
    minimap;//minimap holder group
    heroMapSprite;//hero marker sprite in the minimap
    gameScene;//this is the render texture onto which we draw depth sorted scene
    floorSprite;
    wallSprite;
    heroMapTile;//hero tile values in array
    heroMapPos;//2D coordinates of hero map marker sprite in minimap, assume this is mid point of graphic
    heroSpeed = 1.2;//well, speed of our hero
    levelData = [
        [1,1,1,1,1,1],
    [1,0,0,0,0,1],
    [1,0,1,0,0,1],
    [1,0,0,2,0,1],
    [1,0,0,0,0,1],
    [1,1,1,1,1,1]];

    preload() {
        //load all necessary assets
        this.game.load.bitmapFont('font', Assets.BitmapFonts.Font.getPNG(),Assets.BitmapFonts.Font.getXML());
        this.game.load.image('greenTile', Assets.Images.GreenTile.getPNG());
        this.game.load.image('redTile', Assets.Images.RedTile.getPNG());
        this.game.load.image('heroTile', Assets.Images.HeroTile.getPNG());
        this.game.load.image('heroShadow', Assets.Images.BallShadow.getPNG());
        this.game.load.image('floor', Assets.Images.Floor.getPNG());
        this.game.load.image('wall', Assets.Images.Block.getPNG());
        this.game.load.image('ball', Assets.Images.Ball.getPNG());
        this.game.load.atlasJSONArray('hero', Assets.Atlases.Hero844162.getPNG(),Assets.Atlases.Hero844162.getJSONArray());
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

        this.bmpText = this.game.add.bitmapText(10, 10, 'font', 'Isometric Tutorial', 18);
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
    }

    update() {
        //check key press
        this.detectKeyInput();
        //if no key is pressed then stop else play walking animation
        if (this.dY == 0 && this.dX == 0) {
            this.sorcerer.animations.stop();
            this.sorcerer.animations.currentAnim.frame = 0;
        } else {
            if (this.sorcerer.animations.currentAnim != this.facing) {
                this.sorcerer.animations.play(this.facing);
            }
        }
        //check if we are walking into a wall else move hero in 2D
        if (this.isWalkable()) {
            this.heroMapPos.x += this.heroSpeed * this.dX;
            this.heroMapPos.y += this.heroSpeed * this.dY;
            this.heroMapSprite.x = this.heroMapPos.x - this.heroMapSprite.width / 2;
            this.heroMapSprite.y = this.heroMapPos.y - this.heroMapSprite.height / 2;
            //get the new hero map tile
            this.heroMapTile = ScreenUtils.getTileCoordinates(this.heroMapPos, this.tileWidth);
            //depthsort & draw new scene
            this.renderScene();
        }
    }

    createLevel() {//create minimap
        this.minimap = this.game.add.group();
        var tileType = 0;
        for (var i = 0; i < this.levelData.length; i++) {
            for (var j = 0; j < this.levelData[0].length; j++) {
                tileType = this.levelData[i][j];
                this.placeTile(tileType, i, j);
                if (tileType == 2) {//save hero map tile
                    this.heroMapTile = new Phaser.Point(i, j);
                }
            }
        }
        this.addHero();
        this.heroMapSprite = this.minimap.create(this.heroMapTile.y * this.tileWidth, this.heroMapTile.x * this.tileWidth, 'heroTile');
        this.heroMapSprite.x += (this.tileWidth / 2) - (this.heroMapSprite.width / 2);
        this.heroMapSprite.y += (this.tileWidth / 2) - (this.heroMapSprite.height / 2);
        this.heroMapPos = new Phaser.Point(this.heroMapSprite.x + this.heroMapSprite.width / 2, this.heroMapSprite.y + this.heroMapSprite.height / 2);
        this.heroMapTile = ScreenUtils.getTileCoordinates(this.heroMapPos, this.tileWidth);
        this.minimap.scale = new Phaser.Point(0.3, 0.3);
        this.minimap.x = 500;
        this.minimap.y = 10;
        this.renderScene();//draw once the initial state
    }
    addHero() {
        // sprite
        this.sorcerer = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 175, Assets.Spritesheets.SpritesheetsOverlord848472.getName());
        //this.sorcerer = this.game.add.sprite(-50, 0, 'hero', 'h1.png');// keep him out side screen area

        // animation
        this.sorcerer.animations.add('southeast', [17,18,19,20], 10, true);
        this.sorcerer.animations.add('south', [52,53,54,55], 6, true);
        this.sorcerer.animations.add('southwest', [36,37,38,39], 6, true);
        this.sorcerer.animations.add('west', [20,21,22,23], 6, true);
        this.sorcerer.animations.add('northwest', [0,1,2,3], 6, true);
        this.sorcerer.animations.add('north', [16, 17,18,19], 6, true);
        this.sorcerer.animations.add('northeast',[32, 33, 34, 35], 10, true);
        this.sorcerer.animations.add('east', [48,49,50,51], 6, true);
    }
    placeTile(tileType, i, j) {//place minimap
        var tile = 'greenTile';
        if (tileType == 1) {
            tile = 'redTile';
        }
        this.minimap.create(j * this.tileWidth, i * this.tileWidth, tile);
    }
    renderScene() {
        this.gameScene.clear(); // clear the previous frame then draw again
        var tileType = 0;
        for (var i = 0; i < this.levelData.length; i++) {
            for (var j = 0; j < this.levelData[0].length; j++) {
                tileType = this.levelData[i][j];
                this.drawTileIso(tileType, i, j);
                if (i == this.heroMapTile.y && j == this.heroMapTile.x) {
                    this.drawHeroIso();
                }
            }
        }
        this.normText.text = 'Hero is on x,y: ' + this.heroMapTile.x + ',' + this.heroMapTile.y;
    }
    drawHeroIso() {
        var isoPt = new Phaser.Point();//It is not advisable to create points in update loop
        var heroCornerPt = new Phaser.Point(this.heroMapPos.x - this.heroMapSprite.width / 2, this.heroMapPos.y - this.heroMapSprite.height / 2);
        isoPt = ScreenUtils.cartesianToIsometric(heroCornerPt);//find new isometric position for hero from 2D map position
        this.gameScene.renderXY(this.sorcererShadow, isoPt.x + this.borderOffset.x + this.shadowOffset.x, isoPt.y + this.borderOffset.y + this.shadowOffset.y, false);//draw shadow to render texture
        this.gameScene.renderXY(this.sorcerer, isoPt.x + this.borderOffset.x + this.heroWidth, isoPt.y + this.borderOffset.y - this.heroHeight, false);//draw hero to render texture
    }
    drawTileIso(tileType, i, j) {//place isometric level tiles
        var isoPt = new Phaser.Point();//It is not advisable to create point in update loop
        var cartPt = new Phaser.Point();//This is here for better code readability.
        cartPt.x = j * this.tileWidth;
        cartPt.y = i * this.tileWidth;
        isoPt = ScreenUtils.cartesianToIsometric(cartPt);
        if (tileType == 1) {
            this.gameScene.renderXY(this.wallSprite, isoPt.x + this.borderOffset.x, isoPt.y + this.borderOffset.y - this.wallHeight, false);
        } else {
            this.gameScene.renderXY(this.floorSprite, isoPt.x + this.borderOffset.x, isoPt.y + this.borderOffset.y, false);
        }
    }
    isWalkable() {//It is not advisable to create points in update loop, but for code readability.
        var able = true;
        var heroCornerPt = new Phaser.Point(this.heroMapPos.x - this.heroMapSprite.width / 2, this.heroMapPos.y - this.heroMapSprite.height / 2);
        var cornerTL = new Phaser.Point();
        cornerTL.x = heroCornerPt.x + (this.heroSpeed * this.dX);
        cornerTL.y = heroCornerPt.y + (this.heroSpeed * this.dY);
        // now we have the top left corner point. we need to find all 4 corners based on the map marker graphics width & height
        //ideally we should just provide the hero a volume instead of using the graphics' width & height
        var cornerTR = new Phaser.Point();
        cornerTR.x = cornerTL.x + this.heroMapSprite.width;
        cornerTR.y = cornerTL.y;
        var cornerBR = new Phaser.Point();
        cornerBR.x = cornerTR.x;
        cornerBR.y = cornerTL.y + this.heroMapSprite.height;
        var cornerBL = new Phaser.Point();
        cornerBL.x = cornerTL.x;
        cornerBL.y = cornerBR.y;
        var newTileCorner1;
        var newTileCorner2;
        var newTileCorner3 = this.heroMapPos;
        //let us get which 2 corners to check based on current facing, may be 3
        switch (this.facing) {
            case "north":
                newTileCorner1 = cornerTL;
                newTileCorner2 = cornerTR;
                break;
            case "south":
                newTileCorner1 = cornerBL;
                newTileCorner2 = cornerBR;
                break;
            case "east":
                newTileCorner1 = cornerBR;
                newTileCorner2 = cornerTR;
                break;
            case "west":
                newTileCorner1 = cornerTL;
                newTileCorner2 = cornerBL;
                break;
            case "northeast":
                newTileCorner1 = cornerTR;
                newTileCorner2 = cornerBR;
                newTileCorner3 = cornerTL;
                break;
            case "southeast":
                newTileCorner1 = cornerTR;
                newTileCorner2 = cornerBR;
                newTileCorner3 = cornerBL;
                break;
            case "northwest":
                newTileCorner1 = cornerTR;
                newTileCorner2 = cornerBL;
                newTileCorner3 = cornerTL;
                break;
            case "southwest":
                newTileCorner1 = cornerTL;
                newTileCorner2 = cornerBR;
                newTileCorner3 = cornerBL;
                break;
        }
        //check if those corners fall inside a wall after moving
        newTileCorner1 = ScreenUtils.getTileCoordinates(newTileCorner1, this.tileWidth);
        if (this.levelData[newTileCorner1.y][newTileCorner1.x] == 1) {
            able = false;
        }
        newTileCorner2 = ScreenUtils.getTileCoordinates(newTileCorner2, this.tileWidth);
        if (this.levelData[newTileCorner2.y][newTileCorner2.x] == 1) {
            able = false;
        }
        newTileCorner3 = ScreenUtils.getTileCoordinates(newTileCorner3, this.tileWidth);
        if (this.levelData[newTileCorner3.y][newTileCorner3.x] == 1) {
            able = false;
        }
        return able;
    }

    detectKeyInput() {//assign direction for character & set x,y speed components
        if (this.upKey.isDown) {
            this.dY = -1;
        }
        else if (this.downKey.isDown) {
            this.dY = 1;
        }
        else {
            this.dY = 0;
        }
        if (this.rightKey.isDown) {
            this.dX = 1;
            if (this.dY == 0) {
                this.facing = "east";
            }
            else if (this.dY == 1) {
                this.facing = "southeast";
                this.dX = this.dY = 0.5;
            }
            else {
                this.facing = "northeast";
                this.dX = 0.5;
                this.dY = -0.5;
            }
        }
        else if (this.leftKey.isDown) {
            this.dX = -1;
            if (this.dY == 0) {
                this.facing = "west";
            }
            else if (this.dY == 1) {
                this.facing = "southwest";
                this.dY = 0.5;
                this.dX = -0.5;
            }
            else {
                this.facing = "northwest";
                this.dX = this.dY = -0.5;
            }
        }
        else {
            this.dX = 0;
            if (this.dY == 0) {
                //facing="west";
            }
            else if (this.dY == 1) {
                this.facing = "south";
            }
            else {
                this.facing = "north";
            }
        }
    }
}
