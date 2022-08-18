const express = require("express");
const { Server } = require("socket.io");
const routes = require("./routes");
const { Db } = require("./db");

const isDev = process.env.NODE_ENV === "development";

const app = express();

// TODO: Don't add user to room if user is already in the room
// TODO: Send users list to user without their id
function initSocketIO(server) {
	const io = new Server(server, { path: "/ws", cors: isDev ? ["*"] : undefined });

	io.on("connection", (socket) => {
		let roomid;

		socket.on("peerid", (peerid) => {
			socket.on("join-room", (rid) => {
				if (!Db.isValidId(rid)) return socket.emit("join-error", "Not a valid room"); // don't join if room is not created
				try {
					socket.join(rid);
					const users = Db.joinRoom(rid, peerid);
					socket.emit("room-joined", users);
					roomid = rid;
				} catch (err) {
					socket.emit("join-error", err.message);
				}
			});

			socket.on("disconnect", () => {
				Db.removeUserFromRoom(roomid, peerid);
				socket.to(roomid).emit("bye-bye", peerid);
			});
		});
	});
}

if (isDev) app.use(require("morgan")("dev"));

app.use("/", routes);

module.exports = { app, initSocketIO };
