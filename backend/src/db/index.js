const { nanoid } = require("nanoid");

const rooms = new Set();

function validId(id) {
	return rooms.has(id);
}

function getNewId() {
	let id = "";

	do {
		id = nanoid(6);
	} while (rooms.has(id));

	return id;
}

module.exports = {
	validId,
	getNewId,
};
