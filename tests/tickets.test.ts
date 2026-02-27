import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../src/app.js";

describe("tickets", () => {
  it("creates and lists tickets", async () => {
    const app = buildApp();

    const email = `t_${Date.now()}@example.com`;
    const password = "password123";

    const reg = await request(app).post("/auth/register").send({ email, password, role: "manager" });
    const token = reg.body.accessToken as string;

    const create = await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test ticket", description: "hello" });

    expect(create.status).toBe(201);

    const list = await request(app)
      .get("/tickets?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);

    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.items)).toBe(true);
  });
});