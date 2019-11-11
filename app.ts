// reads in our .env file and makes those values available as environment variables
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const routes = require('./routes/main');
const secureRoutes = require('./routes/secure');
const passwordRoutes = require('./routes/password');
const asyncMiddleware = require('./middleware/asyncMiddleware');
const ChatModel = require('./models/chatModel');

// setup mongo connection
const uri = process.env.MONGO_CONNECTION_URL;
mongoose.connect(uri, { useNewUrlParser : true, useCreateIndex: true });
mongoose.connection.on('error', (error: any) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on('connected', function () {
  console.log('connected to mongo');
});
mongoose.set('useFindAndModify', false);

// create an instance of an express app
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

const players : any = {};

io.on('connection', function (socket: { id: string | number; emit: (arg0: string, arg1: {}) => void; broadcast: { emit: { (arg0: string, arg1: any): void; (arg0: string, arg1: any): void; }; }; on: { (arg0: string, arg1: () => void): void; (arg0: string, arg1: (movementData: any) => void): void; }; }) {
  console.log('a user connected: ', socket.id);
  // create a new player and add it to our players object
  players[socket.id]  = {
    flipX: false,
    x: Math.floor(Math.random() * 400) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id
  };
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });

  // when a plaayer moves, update the player data
  socket.on('playerMovement', function (movementData: { x: any; y: any; flipX: any; }) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].flipX = movementData.flipX;
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });
});

// update express settings
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser());

// require passport auth
require('./auth/auth');

app.get('/game.html', passport.authenticate('jwt', { session : false }), function (req: any, res: { sendFile: (arg0: string) => void; }) {
  res.sendFile(__dirname + '/public/game.html');
});

app.get('/game.html', function (req: any, res: { sendFile: (arg0: string) => void; }) {
  res.sendFile(__dirname + '/public/game.html');
});

app.use(express.static(__dirname + '/public'));

app.get('/', function (req: any, res: { sendFile: (arg0: string) => void; }) {
  res.sendFile(__dirname + '/index.html');
});

// main routes
app.use('/', routes);
app.use('/', passwordRoutes);
app.use('/', passport.authenticate('jwt', { session : false }), secureRoutes);

app.post('/submit-chatline', passport.authenticate('jwt', { session : false }), asyncMiddleware(async (req: { body: { message: any; }; user: { email: any; name: any; }; }, res: { status: (arg0: number) => { json: (arg0: { status: string; }) => void; }; }, next: any) => {
  const { message } = req.body;
  const { email, name } = req.user;
  await ChatModel.create({ email, message });
  io.emit('new message', {
    username: name,
    message,
  });
  res.status(200).json({ status: 'ok' });
}));

// catch all other routes
app.use((req: any, res: { status: (arg0: number) => { json: (arg0: { message: string; }) => void; }; }, next: any) => {
  res.status(404).json({ message: '404 - Not Found' });
});

// handle errors
app.use((err: { message: any; status: any; }, req: any, res: { status: (arg0: any) => { json: (arg0: { error: any; }) => void; }; }, next: any) => {
  console.log(err.message);
  res.status(err.status || 500).json({ error: err.message });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
