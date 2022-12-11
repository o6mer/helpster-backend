const mongoose = require("mongoose");

const time = new Date();
const currentTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

const chatSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  costumerName: String,
  isOpen: { type: Boolean, default: false },
  messages: Array,
  creationTime: {
    type: String,
    default: currentTime,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

export { Chat };
