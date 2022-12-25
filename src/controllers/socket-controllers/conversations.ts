import { TConversation } from "../../Types/Types";
import { createConversation, getResponse } from "../conversationController";

export const conversationsSocketController = (io: any, socket: any) => {
  socket.on("createConversation", onCreateConversation);
  socket.on("getResponse", onGetResponse);

  async function onCreateConversation(conversationData: TConversation) {
    const conversation = await createConversation(conversationData);
    return conversation;
  }

  async function onGetResponse(question: string) {
    getResponse(question);
  }
};
