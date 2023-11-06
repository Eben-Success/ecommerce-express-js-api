const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "tHISisMyS3cr3tK3y8668768767867", { expiresIn: "1d" });
};

module.exports = { generateToken };
