const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  costumer: [{ id: { type: "string", unique: true }, name: String }],
  isOpen: Boolean,
  messages: Array,
  creationTime: String,
});

const chat = mongoose.model("chat", chatSchema);

export { chat };
