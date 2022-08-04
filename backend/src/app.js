const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const routes = require("./routes");

const isDev = process.env.NODE_ENV === "development";
const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, { path: "/ws", cors: isDev ? ["*"] : undefined });

app.use("/", routes);

if (isDev) {
	app.use(require("morgan")("dev"));
}

server.listen(PORT, (err) => {
	if (err) return console.error("Could not start the server", err);
	console.log(`Server can be access on https://localhost:${PORT}`);
});
