import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../src/app.js";

describe("auth", () => {
  it("registers and logs in", async () => {
    const app = buildApp();

    const email = `test_${Date.now()}@example.com`;
    const password = "password123";

    const reg = await request(app).post("/auth/register").send({ email, password });
    expect(reg.status).toBe(201);
    expect(reg.body.accessToken).toBeTruthy();

    const login = await request(app).post("/auth/login").send({ email, password });
    expect(login.status).toBe(200);
    expect(login.body.accessToken).toBeTruthy();
  });
});