import {State, World} from "@colyseus/ecs"
import "@geckos.io/phaser-on-nodejs";
import { Client, Room } from "colyseus";
import Hero from "./hero";
import { HeroSchema } from "./schemas";
import {InputComponent} from "../../common/components/InputComponent";

export default class HeroRoom extends Room<State> {

  world = new World();

  onCreate(): void {
    this.setState(new State());

    const game = new Phaser.Game({
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
    });

    game.scene.add("hero", Hero);
    game.scene.start("hero");
  }

  onJoin(client: Client): void {
    console.log("client joined: " + client.sessionId)
    // this.state.addPlayer(client.sessionId);
    this.world.createEntity()
        .addComponent(InputComponent)
  }

  async onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left", {consented});
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
