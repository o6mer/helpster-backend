import { TChat, TConversation, TMessage, TTemplate } from "../../Types/Types";
import { addMessage, createNewChat, getAllChats } from "../chatsController";
import { getAllConversations, getResponse } from "../conversationController";
import { getAllTemplates } from "../templatesController";
import { checkToken } from "../usersController";
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

  async function onNewAdminConnection(
    token: string,
    callback: (adaminData: {
      isAuth: boolean;
      chatList?: Array<TChat>;
      templateList?: Array<TTemplate>;
      covnersationList?: Array<TConversation>;
    }) => void
  ) {
    const user = await checkToken(token);

    if (!user) return callback({ isAuth: false });

    const chatList = await getAllChats("open");
    const templateList = await getAllTemplates();
    const covnersationList = await getAllConversations();
    socket.join(chatList?.map((chat: TChat) => chat.id));
    callback({ isAuth: true, chatList, covnersationList, templateList });
  }
};
