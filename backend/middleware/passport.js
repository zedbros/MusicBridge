const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcrypt");
const { getDB } = require("../../db/MongoDB");

// Local strategy — used for login
passport.use(new LocalStrategy(
  { usernameField: "nick_email", passwordField: "password" },
  async (nick_email, password, done) => {
    try {
      const db = getDB();
      const user = await db.collection("users").findOne({
        $or: [{ nickname: nick_email }, { email: nick_email }]
      });

      if (!user) return done(null, false, { message: "Invalid nickname or email." });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Invalid password." });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// JWT.. used to protect routes and GraphQL context
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    try {
      const db = getDB();
      const user = await db.collection("users").findOne({ nickname: payload.nickname });
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

module.exports = passport;
