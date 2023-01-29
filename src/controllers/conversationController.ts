import { TConversation, TMessage } from "../Types/Types";
const { v4: uuidv4 } = require("uuid");
const { Conversation } = require("../models/conversationModel ");

const getAllConversations = async () => {
  try {
    const conversations = await Conversation.find({});
    return conversations;
  } catch (err) {
    console.log(err);
  }
};

const createConversation = async ({
  question,
  response,
  followUp,
  position,
}: TConversation) => {
  try {
    const exisitng = await Conversation.find({});

    const isFirst = !exisitng.length;

    const conversation = new Conversation({
      id: !isFirst ? uuidv4() : "main",
      isFirst,
      question,
      response,
      followUp,
      position,
    });
    return await conversation.save();
  } catch (err) {
    console.log(err);
  }
};

const updateConversation = async ({
  id,
  question,
  response,
  followUp,
}: TConversation) => {
  try {
    const conversation = await Conversation.findOne({ id: id });

    conversation.question = question;
    conversation.response = response;
    conversation.followUp = followUp;

    return await conversation.save();
  } catch (err) {
    console.log(err);
  }
};

const getResponse = async (conversationId: string) => {
  try {
    const conversation: TConversation = await Conversation.findOne({
      id: conversationId || "main",
    });

    return conversation;
  } catch (err) {
    console.log(err);
  }
};

const deleteConversation = async (conversationId: string) => {
  try {
    await Conversation.deleteOne({ id: conversationId });
  } catch (err) {
    console.log(err);
  }
};

const saveAllConversations = async (
  updatedConversations: Array<TConversation>
) => {
  try {
    const conversations = await Conversation.find({});
    conversations.forEach(async (conversation: any) => {
      const find =
        updatedConversations.find((c) => c.id === conversation.id) ||
        conversation;
      conversation.question = find.question;
      conversation.response = find.response;
      conversation.followUp = find.followUp;
      conversation.position = find.position;
      await conversation.save();
    });
  } catch (err) {
    console.log(err);
  }
};

export {
  getAllConversations,
  createConversation,
  updateConversation,
  getResponse,
  deleteConversation,
  saveAllConversations,
};
