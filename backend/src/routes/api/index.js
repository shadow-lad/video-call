const { Router } = require("express");
const roomRouter = require("./room");

const router = Router();

router.use("/room", roomRouter);

module.exports = router;
