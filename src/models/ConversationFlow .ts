const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  question: String,
  response: String,
  followUp: {
    type: Array,
    of: {
      type: Map,
      of: String,
    },
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export { Conversation };
