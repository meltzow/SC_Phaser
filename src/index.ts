import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';

const game = new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene]
  })
);

window.addEventListener('load', () =>
{
    window.addEventListener('resize', event =>
    {
        for (let i = 0; i < game.scene.scenes.length; i++)
        {
            (game.scene.scenes[i] as any).resizeGameContainer();
        }
    });
});
