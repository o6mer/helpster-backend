const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  customerName: String,
  status: { type: String, default: "open" },
  isSeen: { type: Boolean, default: false },
  messages: Array,
  creationTime: {
    type: String,
  },
  assignedAdmins: Array,
});

const Chat = mongoose.model("Chat", chatSchema);

export { Chat };
