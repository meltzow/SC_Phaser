import {State, World} from "@colyseus/ecs"
import "@geckos.io/phaser-on-nodejs";
import { Client, Room } from "colyseus";
import InGameScene from "./inGameScene";
import { HeroSchema } from "./schemas";
import {InputComponent} from "../../common/components/InputComponent";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";

export default class HeroRoom extends Room<State> {

  world = new World()
  game

  onCreate(): void {
    this.setState(new State());

    this.game = new Phaser.Game({
      type: Phaser.HEADLESS,
      width: 800,
      height: 600,
      autoFocus: false,
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      plugins: {
        scene: [{
          key: 'rexBoard',
          plugin: BoardPlugin,
          mapping: 'rexBoard'
        },
        ]
      }
    });


  }

  onJoin(client: Client): void {
    console.log("client joined: " + client.sessionId)
    // this.state.addPlayer(client.sessionId);
    this.world.createEntity()
        .addComponent(InputComponent)
    this.game.scene.add("hero", InGameScene, true, {world: this.world});
    // this.game.scene.start("hero");
  }

  async onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left", {consented});
    this.game.scene.stop("hero")
    this.game.scene.remove("hero")
    // if (this.state.hasPlayer(client.sessionId)) {
    //   this.state.deletePlayer(client.sessionId);
    // }
    try {
      if (consented) {
        /*
         * Optional:
         * you may want to allow reconnection if the client manually closed the connection.
         */
        throw new Error("left_manually");
      }

      await this.allowReconnection(client, 60);
      console.log("Reconnected!");

      client.send("status", "Welcome back!");

    } catch (e) {
      console.log(e);

    }
  }

  onDispose() {
    this.world.stop();
  }
}
