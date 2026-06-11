// Unit tests — no DB or server needed
describe("Form validation logic", () => {

  // Unit test 1: password hashing produces different output
  test("bcrypt hash differs from plain password", async () => {
    const bcrypt = require("bcrypt");
    const plain = "mypassword";
    const hashed = await bcrypt.hash(plain, 10);
    expect(hashed).not.toBe(plain);
  });

  // Unit test 2: JWT encodes and decodes nickname correctly
  test("JWT sign and verify round-trip", () => {
    const jwt = require("jsonwebtoken");
    const secret = "testsecret";
    const payload = { nickname: "alice" };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    const decoded = jwt.verify(token, secret);
    expect(decoded.nickname).toBe("alice");
  });
});
