import {
  TChat,
  TConversation,
  TMessage,
  TTemplate,
  TUser,
} from "../../Types/Types";
import { addMessage, createNewChat, getAllChats } from "../chatsController";
import { getAllConversations, getResponse } from "../conversationController";
import { getAllTemplates } from "../templatesController";
import { checkToken, getUsersFromIds } from "../usersController";
import { conversationToMessage } from "./conversations";

export let onlineAdmins: Array<string> = [];

export const usersSocketController = (io: any, socket: any) => {
  socket.on("newUserConnection", onNewUserConnection);
  socket.on("newAdminConnection", onNewAdminConnection);
  socket.on("adminDisconnect", onAdminDisconnect);

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

  async function onNewAdminConnection(
    token: string,
    callback: (adaminData: {
      isAuth: boolean;
      chatList?: Array<TChat>;
      templateList?: Array<TTemplate>;
      covnersationList?: Array<TConversation>;
      onlineAdmins?: Array<string | undefined>;
    }) => void
  ) {
    const user: TUser = await checkToken(token);

    if (!user) return callback({ isAuth: false });

    const chatList = await getAllChats("open");
    const templateList = await getAllTemplates();
    const covnersationList = await getAllConversations();
    socket.join(chatList?.map((chat: TChat) => chat.id));

    user.status = "active";
    onlineAdmins.push(user.username);

    const admins = await getUsersFromIds(onlineAdmins);

    callback({
      isAuth: true,
      chatList,
      covnersationList,
      templateList,
      onlineAdmins: admins,
    });
  }

  async function onAdminDisconnect(userId: string) {
    onlineAdmins = onlineAdmins.filter((id) => id !== userId);
    const admins = await getUsersFromIds(onlineAdmins);
    io.emit("adminDisconnected", admins);
  }
};
