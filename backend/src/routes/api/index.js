const { Router } = require("express");
const create_room = require("./create-room");

const router = Router();

router.use("/create-room", create_room);

module.exports = router;
