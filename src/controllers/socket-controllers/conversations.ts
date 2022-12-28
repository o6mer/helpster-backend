import { TConversation } from "../../Types/Types";
import {
  createConversation,
  deleteConversation,
  getAllConversations,
  getResponse,
} from "../conversationController";

export const conversationsSocketController = (io: any, socket: any) => {
  socket.on("getAllConversations", onGetAllConversations);
  socket.on("createConversation", onCreateConversation);
  socket.on("getResponse", onGetResponse);
  socket.on("deleteConversation", onDeleteConversation);

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

  async function onGetResponse(question: string) {
    getResponse(question);
  }

  async function onDeleteConversation(conversationId: string) {
    await deleteConversation(conversationId);
  }
};
