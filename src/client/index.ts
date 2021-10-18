import Phaser from "phaser";
import config from "./config";
import InGame from "./scenes/InGame";

document.addEventListener("DOMContentLoaded", async () => {
    const game = new Phaser.Game(
        Object.assign(config, {
            scene: [InGame]
        })
    );
});


// window.addEventListener('load', () =>
// {
//     window.addEventListener('resize', event =>
//     {
//         for (let i = 0; i < game.scene.scenes.length; i++)
//         {
//             (game.scene.scenes[i] as any).resizeGameContainer();
//         }
//     });
// });