const { nanoid } = require("nanoid");

//TODO: Transition to a persistant DB cause atomic operations is important

class Db {
	static rooms = new Map();

	static isValidId(id) {
		return this.rooms.has(id);
	}

	static joinRoom(roomid, userid) {
		const users = this.rooms.get(roomid);
		if (users.length >= 10) {
			throw Error("No more room");
		}
		this.rooms.set(roomid, [...users, userid]);
		return users;
	}

	static removeUserFromRoom(roomid, userid) {
		if (!this.isValidId(roomid)) return;
		let users = this.rooms.get(roomid);
		users = users.filter((user) => user !== userid);
		this.rooms.set(roomid, [...users]);
	}

	static getNewId() {
		let id;

		do {
			id = nanoid(6);
		} while (this.isValidId(id));

		this.rooms.set(id, []);

		return id;
	}
}

module.exports = { Db };
