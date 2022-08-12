const { createServer } = require("http");
const { app, initSocketIO } = require("./app");

const PORT = process.env.PORT || 3000;

const server = createServer(app);
initSocketIO(server);

server.listen(PORT, (err) => {
	if (err) return console.error("Could not start the server", err);
	console.log(`Server can be accessed on https://localhost:${PORT}`);
});
