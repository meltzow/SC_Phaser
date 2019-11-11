"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// reads in our .env file and makes those values available as environment variables
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var routes = require('./routes/main');
var secureRoutes = require('./routes/secure');
var passwordRoutes = require('./routes/password');
var asyncMiddleware = require('./middleware/asyncMiddleware');
var ChatModel = require('./models/chatModel');
// setup mongo connection
var uri = process.env.MONGO_CONNECTION_URL;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
mongoose.connection.on('error', function (error) {
    console.log(error);
    process.exit(1);
});
mongoose.connection.on('connected', function () {
    console.log('connected to mongo');
});
mongoose.set('useFindAndModify', false);
// create an instance of an express app
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var players = {};
io.on('connection', function (socket) {
    console.log('a user connected: ', socket.id);
    // create a new player and add it to our players object
    players[socket.id] = {
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
    socket.on('playerMovement', function (movementData) {
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
app.get('/game.html', passport.authenticate('jwt', { session: false }), function (req, res) {
    res.sendFile(__dirname + '/public/game.html');
});
app.get('/game.html', function (req, res) {
    res.sendFile(__dirname + '/public/game.html');
});
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
// main routes
app.use('/', routes);
app.use('/', passwordRoutes);
app.use('/', passport.authenticate('jwt', { session: false }), secureRoutes);
app.post('/submit-chatline', passport.authenticate('jwt', { session: false }), asyncMiddleware(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var message, _a, email, name;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                message = req.body.message;
                _a = req.user, email = _a.email, name = _a.name;
                return [4 /*yield*/, ChatModel.create({ email: email, message: message })];
            case 1:
                _b.sent();
                io.emit('new message', {
                    username: name,
                    message: message,
                });
                res.status(200).json({ status: 'ok' });
                return [2 /*return*/];
        }
    });
}); }));
// catch all other routes
app.use(function (req, res, next) {
    res.status(404).json({ message: '404 - Not Found' });
});
// handle errors
app.use(function (err, req, res, next) {
    console.log(err.message);
    res.status(err.status || 500).json({ error: err.message });
});
server.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port " + (process.env.PORT || 3000));
});
