import request from "supertest";
import app from "../src/app";

describe("Patients API", () => {
    const testUser = {
        email: `testuser_${Date.now()}@example.com`,
        password: "TestPassword123!",
        role: "admin"
    };
    let token: string;

    it("should sign up a new user", async () => {
        const res = await request(app)
            .post("/auth/signup")
            .send(testUser);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message");
    });

    it("should login and get a token", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: testUser.email, password: testUser.password });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        token = res.body.token;
    });

    it("should require authentication", async () => {
        const res = await request(app).get("/patients");
        expect(res.statusCode).toBe(401);
    });

    it("should return patients for authenticated user", async () => {
        const res = await request(app)
            .get("/patients")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true); // <-- Fix here
    });
});