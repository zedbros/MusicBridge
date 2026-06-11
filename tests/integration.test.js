const request = require("supertest");
const express = require("express");

// We build a minimal app with just auth routes for testing
// so we don't need a real DB connection for basic checks

describe("Auth routes integration", () => {

  // Integration test 1: signup with missing fields returns 400
  test("POST /api/auth/signUp with missing fields returns 400", async () => {
    // Minimal app setup
    require("dotenv").config({ path: "../.env" });
    const { connectDB } = require("../db/MongoDB");
    await connectDB();

    const app = express();
    app.use(express.json());
    const authRoutes = require("../routes/auth");
    app.use("/api/auth", authRoutes);

    const res = await request(app)
      .post("/api/auth/signUp")
      .send({ email: "test@test.com" }); // missing password and nickname

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("All fields are required.");
  });

  // Integration test 2: login with wrong password returns 401
  test("POST /api/auth/login with wrong credentials returns 401", async () => {
    require("dotenv").config({ path: "../.env" });
    const { connectDB } = require("../db/MongoDB");
    await connectDB();

    const app = express();
    app.use(express.json());
    const passport = require("../middleware/passport");
    app.use(passport.initialize());
    const authRoutes = require("../routes/auth");
    app.use("/api/auth", authRoutes);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ nick_email: "nobody@nowhere.com", password: "wrongpass" });

    expect(res.status).toBe(401);
  });
});
