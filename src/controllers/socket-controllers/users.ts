import { TChat, TMessage } from "../../Types/Types";
import { addMessage, createNewChat, getAllChats } from "../chatsController";
import { getResponse } from "../conversationController";
import { conversationToMessage } from "./conversations";

export const usersSocketController = (io: any, socket: any) => {
  socket.on("newUserConnection", onNewUserConnection);
  socket.on("newAdminConnection", onNewAdminConnection);

  async function onNewUserConnection(callback: (chatId: string) => void) {
    const newChat = await createNewChat();
    const chatId = newChat?.id;
    socket.join(chatId);
    callback(chatId);
    io.emit("newChatStarted", newChat);
    const conversation = await getResponse("");
    const message = conversationToMessage(conversation);

    io.to(chatId).emit("receiveMessage", { message });
  }

  async function onNewAdminConnection(callback: (list: Array<any>) => void) {
    const allChats = await getAllChats("open");
    socket.join(allChats?.map((chat: TChat) => chat.id));
    callback(allChats);
  }
};
