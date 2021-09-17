import Phaser from 'phaser';
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";

export default {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#33A5E7',
    scale: {
        width: 800,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    plugins: {
        scene: [{
            key: 'rexBoard',
            plugin: BoardPlugin,
            mapping: 'rexBoard'
        },
        ]
    }
};
