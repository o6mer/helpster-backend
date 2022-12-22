import { TConversation } from "../../Types/Types";
import { createConversation, getResponse } from "../conversationController";

export const conversationsSocketController = (io: any, socket: any) => {
  socket.on("createConversation", onCreateConversation);
  socket.on("getResponse", onGetResponse);

  async function onCreateConversation(conversationData: TConversation) {
    console.log(conversationData);
    const conversation = await createConversation(conversationData);
    console.log(conversation);
  }

  async function onGetResponse(question: string) {
    getResponse(question);
  }
};
