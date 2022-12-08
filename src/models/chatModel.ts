const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const chatSchema = new mongoose.Schema({
  costumer: [
    { id: { type: String, unique: true, default: uuidv4() }, name: String },
  ],
  isOpen: { type: Boolean, default: false },
  messages: Array,
  creationTime: { type: Date, default: new Date().getTime() },
});

const Chat = mongoose.model("Chat", chatSchema);

export { Chat };
