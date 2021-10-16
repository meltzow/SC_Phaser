import Phaser from 'phaser'
import {
	createWorld,
	addEntity,
	addComponent,
} from 'bitecs'

import type {
	IWorld,
	System
} from 'bitecs'

import Position from '../components/Position'
import Velocity from '../components/Velocity'
import Sprite, {SpriteTextures} from '../components/Sprite'
import Rotation from '../components/Rotation'
import CPU from '../components/CPU'
import Game1 from '../components/Game'

import createMovementSystem, {preloadMovementSystem} from '../systems/movement'
import createSpriteSystem, {preloadSpriteSystem} from '../systems/sprite'
import createInputSystem from '../systems/input'
import createCPUSystem from '../systems/cpu'
import createHudSystem, {preloadHudSystem} from "../systems/hud";
import createLevelSystem, {preloadLevelSystem} from "../systems/level";
import createControlSystem from "../systems/controls";
import Unit from "../components/Unit";
import Selectable from "../components/Selectable";
import createDebugSystem from "../systems/debug";
import Speed from "../components/Speed";
import Tilemap = Phaser.Tilemaps.Tilemap;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import Commandable from "../components/Commandable";
import * as socketio from 'socket.io';


export default class Start extends Phaser.Scene
{
	private blueScoreText: Phaser.GameObjects.Text
	private redScoreText: Phaser.GameObjects.Text
	private socket: any;
	private players: any;
	private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	private leftKeyPressed: boolean;
	private rightKeyPressed: boolean;
	private upKeyPressed: boolean;
	private star: any;

	constructor()
	{
		super('game')
		// this.gameContainer = document.getElementById('game-container');
	}



	preload()
    {

    }

	displayPlayers(playerInfo: { x: number; y: number; team: string; playerId: any }, sprite: string) {
		const player = this.add.sprite(playerInfo.x, playerInfo.y, sprite).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
		if (playerInfo.team === 'blue') player.setTint(0x0000ff);
		else player.setTint(0xff0000);
		player.playerId = playerInfo.playerId;
		this.players.add(player);
	}

    create()
    {
		this.socket = Socket.io();
		this.players = this.add.group();

		this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
		this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });

		this.socket.on('currentPlayers', (players: { [x: string]: any }) => {
			Object.keys(players).forEach((id) => {
				if (players[id].playerId === this.socket.id) {
					this.displayPlayers(players[id], 'ship');
				} else {
					this.displayPlayers(players[id], 'otherPlayer');
				}
			});
		});

		this.socket.on('newPlayer', (playerInfo: any) => {
			this.displayPlayers( playerInfo, 'otherPlayer');
		});

		this.socket.on('disconnect', (playerId: any) => {
			this.players.getChildren().forEach((player: { playerId: any; destroy: () => void }) => {
				if (playerId === player.playerId) {
					player.destroy();
				}
			});
		});

		this.socket.on('playerUpdates', (players: { [x: string]: { y: any } }) => {
			Object.keys(players).forEach((id) => {
				this.players.getChildren().forEach(function (player: { playerId: any; setRotation: (arg0: any) => void; setPosition: (arg0: any, arg1: any) => void }) {
					if (players[id].playerId === player.playerId) {
						player.setRotation(players[id].rotation);
						player.setPosition(players[id].x, players[id].y);
					}
				});
			});
		});

		this.socket.on('updateScore', (scores: { blue: string; red: string }) => {
			this.blueScoreText.setText('Blue: ' + scores.blue);
			this.redScoreText.setText('Red: ' + scores.red);
		});

		this.socket.on('starLocation', (starLocation: { x: number; y: number }) => {
			if (!this.star) {
				this.star = this.add.image(starLocation.x, starLocation.y, 'star');
			} else {
				this.star.setPosition(starLocation.x, starLocation.y);
			}
		});

		this.cursors = this.input.keyboard.createCursorKeys();
		this.leftKeyPressed = false;
		this.rightKeyPressed = false;
		this.upKeyPressed = false;
    }

	update() {
		const left = this.leftKeyPressed;
		const right = this.rightKeyPressed;
		const up = this.upKeyPressed;

		if (this.cursors.left.isDown) {
			this.leftKeyPressed = true;
		} else if (this.cursors.right.isDown) {
			this.rightKeyPressed = true;
		} else {
			this.leftKeyPressed = false;
			this.rightKeyPressed = false;
		}

		this.upKeyPressed = this.cursors.up.isDown;

		if (left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed) {
			this.socket.emit('playerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed });
		}
	}

}

