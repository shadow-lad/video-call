const { Router } = require("express");
const { getNewId } = require("../../db");

const router = Router();

router.route("/").post((_, res) => {
	const id = getNewId();

	res.redirect(`/room/${id}`);
});

module.exports = router;
