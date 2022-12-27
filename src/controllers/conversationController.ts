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
}: TConversation) => {
  try {
    const conversation = new Conversation({
      id: uuidv4(),
      question,
      response,
      followUp,
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

const getResponse = async (question: string) => {
  try {
    const conversation: TConversation = await Conversation.findOne({
      question,
    });

    return conversation.response;
  } catch (err) {
    console.log(err);
  }
};

export {
  getAllConversations,
  createConversation,
  updateConversation,
  getResponse,
};
