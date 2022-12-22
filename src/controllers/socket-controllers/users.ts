import { TChat } from "../../Types/Types";
import { createNewChat, getAllChats } from "../chatsController";

export const usersSocketController = (io: any, socket: any) => {
  socket.on("newUserConnection", onNewUserConnection);
  socket.on("newAdminConnection", onNewAdminConnection);

  async function onNewUserConnection(callback: (chatId: string) => void) {
    const newChat = await createNewChat();
    const chatId = newChat?.id;
    socket.join(chatId);
    callback(chatId);
    io.emit("newChatStarted", newChat);
  }

  async function onNewAdminConnection(callback: (list: Array<any>) => void) {
    const allChats = await getAllChats("open");
    socket.join(allChats?.map((chat: TChat) => chat.id));
    callback(allChats);
  }
};
