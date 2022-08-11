const request = require("supertest");
const { app } = require("./utils");

describe("/api/room tests", () => {
	let appTest;
	let id;

	beforeAll(() => {
		appTest = request(app);
	});

	test("create new room id", async () => {
		const res = await appTest.post("/api/room");

		expect(res.statusCode).toBe(302);
		expect(res.headers.location).toHaveLength(7); // '/' + nanoid

		id = res.headers.location.substring(1); // store id
	});

	test("room id is present", async () => {
		const res = await appTest.get(`/api/room?id=${id}`);
		expect(res.statusCode).toBe(200);
	});

	test("room id is not present", async () => {
		const res = await appTest.get("/api/room?id=000000");
		expect(res.statusCode).toBe(404);
	});

	test("room id is invalid", async () => {
		const res = await appTest.get("/api/room?id=");
		expect(res.statusCode).toBe(400);
	});
});
