import { TConversation, TMessage } from "../../Types/Types";
import {
  createConversation,
  deleteConversation,
  getAllConversations,
  getResponse,
  updateConversation,
} from "../conversationController";
const date = require("date-and-time");

export const conversationToMessage = (
  conversation: TConversation | undefined
) => {
  if (!conversation) return;
  const message: TMessage = {
    writer: "Bot",
    time: date.format(new Date(), "HH:mm"),
    type: "multiple",
    content: {
      question: conversation?.question,
      response: conversation?.response,
      followUp: conversation?.followUp,
    },
  };

  return message;
};

export const conversationsSocketController = (io: any, socket: any) => {
  socket.on("getAllConversations", onGetAllConversations);
  socket.on("createConversation", onCreateConversation);
  socket.on("getResponse", onGetResponse);
  socket.on("deleteConversation", onDeleteConversation);
  socket.on("updateConversation", onUpdateConversation);

  async function onGetAllConversations(
    callback: (conversations: Array<TConversation>) => void
  ) {
    const allConversations = await getAllConversations();
    callback(allConversations);
  }

  async function onCreateConversation(
    conversationData: TConversation,
    callback: (conversation: TConversation) => void
  ) {
    const conversation = await createConversation(conversationData);
    callback(conversation);
  }

  async function onGetResponse({
    conversationId,
    chatId,
  }: {
    conversationId: string;
    chatId: string;
  }) {
    const conversation = await getResponse(conversationId);
    const message = conversationToMessage(conversation);

    io.to(chatId).emit("receiveMessage", { message });
  }

  async function onDeleteConversation(conversationId: string) {
    await deleteConversation(conversationId);
  }

  async function onUpdateConversation(conversation: TConversation) {
    await updateConversation(conversation);
  }
};
