import { ColyseusTestServer, boot } from "@colyseus/testing";

// import your "arena.config.ts" file here.
import appConfig from "./arena.config";

describe("testing your Colyseus app", () => {
    let colyseus: ColyseusTestServer;

    beforeAll(async () => colyseus = await boot(appConfig));
    afterAll(async () => await colyseus.shutdown());

    beforeEach(async () => await colyseus.cleanup());

    it("connecting into a room", async() => {
        // `room` is the server-side Room instance reference.
        const room = await colyseus.createRoom("my_room", {});

        // `client1` is the client-side `Room` instance reference (same as JavaScript SDK)
        const client1 = await colyseus.connectTo(room);

        // make your assertions
        expect(client1.sessionId).toEqual(room.clients[0].sessionId);
    });

    it("should receive message", async() => {
        const room = await colyseus.createRoom("my_room");
        const client1 = await colyseus.connectTo(room);

        client1.send("foo", "payload");

        // wait for specific a message
        const [ client, message ] = await room.waitForMessage("foo");

        // ... message "foo" has been received and processed
        expect(client.sessionId).toStrictEqual(client1.sessionId);
        expect("payload").toStrictEqual(message);
    });

    it("client state must match server's after patch is received", async() => {
        const room = await colyseus.createRoom("my_room");
        const client1 = await colyseus.connectTo(room);

        await room.waitForNextPatch();

        // server and client's state must match after the patch
        expect(client1.state.toJSON()).toStrictEqual(room.state.toJSON());
    });

    it("should assert something after room's simulation tick", async() => {
        const room = await colyseus.createRoom("my_room");
        const client1 = await colyseus.connectTo(room);

        await room.waitForNextSimulationTick();

        // (this is just an illustration scenario)
        // (assuming the room's state has a "tick" property that updates during setSimulationInterval())
        expect(room.state.tick).toStrictEqual(1);
    });
});