import * as express from "express"
import * as path from "path"
import { Player } from "../shared/model/player"
import Phaser from "phaser";
import GameScene from "./scenes/Game"
import { Server } from 'socket.io';

const app = express()
app.set("port", process.env.PORT || 9001)

// const server = createServer(app);
// const socketio = new Server(app);
export const viteNodeApp = app;

app.use(express.static(path.join( __dirname, "../client")))

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./dist/client/index.html"))
})

const server = app.listen(9001, function() {
  console.log("listening on *:9001")
})

const socketio = new Server(server);
// export const viteNodeApp = app;

socketio.on("connection", function(socket: any) {
  console.log("Client connected!")
  socket.on("msg", function(msg: any) {
    const player = new Player(msg)
    console.log(player.getName())
  })
})

const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  autoFocus: false
}



// const game = new Phaser.Game(config)
// const game = new Phaser.Game(
//     Object.assign(config, {
//       scene: [GameScene]
//     })
// );
