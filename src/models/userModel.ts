const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: "string", unique: true },
  email: { type: "string", unique: true },
  password: String,
  roll: String,
});

const User = mongoose.model("User", userSchema);

module.exports = { User };

export {};
