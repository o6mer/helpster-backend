const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  question: String,
  response: String,
  followUp: [
    {
      input: String,
      conversation: {
        type: String,
        ref: "ConversationFlow",
      },
    },
  ],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export { Conversation };
