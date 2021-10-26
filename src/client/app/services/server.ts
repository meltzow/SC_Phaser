import {Client, Room} from "colyseus.js";
import Phaser from "phaser";
import {HeroesState} from "../../../common/types/states";
import InGame from "../scenes/inGame";
import {State} from "../../../common/components/components";
import HeroRoom from "../../../server/game/rooms";
import {Entity} from "@colyseus/ecs";

export enum Event {
    InitRoomState = "once-state-changed",
    RoomStateChanged = "on-state-changed",
    RoomJoined = "on-room-joined"
}

export default class Server {
    private client: Client;
    private events: Phaser.Events.EventEmitter;
    private room?: Room<State>;

    constructor() {
        this.client = new Client("ws://0.0.0.0:8080");
        this.events = new Phaser.Events.EventEmitter();
    }

    async join(): Promise<void> {
        this.room = await this.client.joinOrCreate<State>("hero", {}, State)
        this.events.emit(Event.RoomJoined, this.room)

        this.room.onStateChange.once((state) => {
            this.events.emit(Event.InitRoomState, state);
        });

        this.room.onStateChange((state) => {
            this.events.emit(Event.RoomStateChanged, state);
        });
    }

    onceStateChanged(
        callback: (state: State) => void,
        context?: InGame
    ): void {
        this.events.once(Event.InitRoomState, callback, context);
    }

    onStateChanged(callback: (state: State) => void, context?: InGame): void {
        this.events.on(Event.RoomStateChanged, callback, context);
    }

    onRoomJoined(callback: (room: Room) => void, context?: InGame) {
        this.events.on(Event.RoomJoined, callback, context);
    }

    leave(): void {
        this.room?.leave();
        this.events.removeAllListeners();
    }


}
