const { createServer } = require("http");
const { nanoid } = require("nanoid");
const { connect } = require("socket.io-client");
const { initSocketIO } = require("../app");
const { Db } = require("../db");

describe("socket.io tests", () => {
	let server, client;

	beforeEach((done) => {
		server = createServer();
		initSocketIO(server);

		server.listen(async () => {
			const PORT = server.address().port;
			client = connect(`http://localhost:${PORT}`, { path: "/ws" });
			client.on("connect", () => {
				client.emit("peerid", nanoid());
				done();
			});
		});
	});

	afterEach((done) => {
		server.close();
		client.close();
		done();
	});

	test("join valid room", (done) => {
		const roomid = nanoid(6);
		const users = [];

		const limit = Math.floor(Math.random() * 10);

		for (let i = 0; i <= limit; i++) users.push(nanoid());

		Db.rooms.set(roomid, users);
		client.emit("join-room", roomid);
		client.on("room-joined", (message) => {
			expect(message).toHaveLength(users.length);
			done();
		});
	});

	test("join invalid room", (done) => {
		const roomid = nanoid(6);
		client.emit("join-room", roomid);
		client.on("join-error", (message) => {
			expect(message).toBe("Not a valid room");
			done();
		});
	});

	test("join full room", (done) => {
		const roomid = nanoid(6);
		Db.rooms.set(roomid, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		client.emit("join-room", roomid);
		client.on("join-error", (message) => {
			expect(message).toBe("No more room");
			done();
		});
	});
});
