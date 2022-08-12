const { Router } = require("express");
const { Db } = require("../../db");

const router = Router();

router
	.route("/")
	.get((req, res) => {
		const { id } = req.query;

		if (!id) return res.sendStatus(400);
		if (Db.isValidId(id)) return res.sendStatus(200);

		return res.sendStatus(404);
	})
	.post((_, res) => {
		const id = Db.getNewId();

		res.redirect(`/${id}`);
	});

module.exports = router;
