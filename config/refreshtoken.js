const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, "tHISisMyS3cr3tK3y8668768767867", { expiresIn: "3d" });
};

module.exports = { generateRefreshToken };
