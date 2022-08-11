const { createServer } = require("http");
const { nanoid } = require("nanoid");
const { connect } = require("socket.io-client");
const { initSocketIO } = require("../app");
const { Db } = require("../db");

describe("socket.io tests", () => {
	let server, client;

	beforeAll((done) => {
		server = createServer();
		initSocketIO(server);

		server.listen(async () => {
			const PORT = server.address().port;
			client = connect(`http://localhost:${PORT}`, { path: "/ws" });
			done();
		});
	});

	test("connect to socket", (done) => {
		client.on("connect", done);
	});

	test("join valid room", (done) => {
		const roomid = nanoid(6);
		Db.rooms.add(roomid);
		client.emit("join-room", roomid);
		client.on("new-user", (message) => {
			expect(message).toContain(client.id);
			done();
		});
	});

	test("join invalid room", (done) => {
		client.emit("join-room", "000000");
		client.on("join-error", () => done());
	});

	afterAll(() => {
		server.close();
		client.close();
	});
});
