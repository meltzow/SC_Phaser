import {State, World} from "@colyseus/ecs"
import "@geckos.io/phaser-on-nodejs";
import { Client, Room } from "colyseus";
import InGameScene from "./inGameScene";
import {InputComponent} from "../../common/components/InputComponent";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import {registerComponents} from "../../common/utils";
import {InputSystem} from "../systems/InputSystem";
import {Player} from "../../common/components/Player";

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
    this.world.useEntities(this.state.entities);
    registerComponents(this.world)

    // this.state.addPlayer(client.sessionId);
    const playerEnt = this.world.createEntity()
        .addComponent(InputComponent)
        .addComponent(Player)

    playerEnt.getMutableComponent(Player).playerId = playerEnt.id
    playerEnt.getMutableComponent(InputComponent).mouseX = 200

    this.game.scene.add("hero", InGameScene, true, {world: this.world});

    // this.setSimulationInterval((delta) => {
    //   //FIXME migrate this to phaser gameloop
    //   this.world.execute(delta);
    // });

    this.onMessage("*", (client, type, message) => {
      this.clients.find(value =>
          value.sessionId == client.sessionId
      )
      console.log("server receives a message from client [" + client.sessionId + "]click @ [" + message!.mouseX + "," + message!.mouseY + "]")
    });

    this.onMessage("pointerdown", (client1, message: InputComponent) => {
      this.clients.find(value =>
          value.sessionId == client.sessionId
      )
      InputSystem.setInput(message)
      console.log("server receives a pointerdown-message from client [" + client.sessionId + "]click @ [" + message!.mouseX + "," + message!.mouseY + "]")
    });
}

  async onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left", {consented});
    this.game.scene.stop("hero")
    this.game.scene.remove("hero")
    this.world = new World()
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
    this.game = null
  }
}
