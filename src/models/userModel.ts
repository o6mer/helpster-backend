const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: "string", unique: true },
  email: { type: "string", unique: true },
  password: String,
  roll: String,
  id: {type: String, unique: true }
});

const User = mongoose.model("User", userSchema);

export { User };
