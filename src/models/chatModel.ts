const mongoose = require("mongoose");

const time = new Date();
const date = require("date-and-time");

const currentTime = date.format(new Date(), "DD/MM/YYYY HH:mm:ss");

const chatSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  customerName: String,
  status: { type: String, default: "open" },
  isSeen: { type: Boolean, default: false },
  messages: Array,
  creationTime: {
    type: String,
    default: currentTime,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

export { Chat };
