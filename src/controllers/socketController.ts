import { TChat, TMessage } from "../Types/Types";
import {
  addMessage,
  createNewChat,
  deleteAllChats,
  fetchChatData,
  getAllChats,
} from "./chatsController";
const date = require("date-and-time");

const onSocketConection = (socket: any, io: any) => {
  socket.on("sendMessage", onSendMessage);
  socket.on("newUserConnection", onNewUserConnection);
  socket.on("newAdminConnection", onNewAdminConnection);
  socket.on("getChatData", getChatData);
  socket.on("deleteAllChats", onDeleteAllChats);
  socket.on("joinChat", onJoinChat);

  async function getChatData(id: string, callback: (chat: TChat) => void) {
    const chatData = await fetchChatData(id);
    callback(chatData);
  }

  async function onNewUserConnection(callback: (chatId: string) => void) {
    const newChat = await createNewChat();
    const chatId = newChat?.id;
    socket.join(chatId);
    callback(chatId);
    io.emit("newChatStarted", newChat);
  }

  async function onNewAdminConnection(callback: (list: Array<any>) => void) {
    const allChats = await getAllChats();
    socket.join(allChats?.map((chat: TChat) => chat.id));
    callback(allChats);
  }

  function onJoinChat(id: string): void {
    socket.join(id);
  }

  function onSendMessage(
    {
      id,
      messageContent,
      user,
    }: {
      id: string;
      messageContent: string;
      user: string;
    },
    callback: (message: TMessage, id: string) => void
  ) {
    const message: TMessage = {
      writer: user || "costumer",
      time: date.format(new Date(), "HH:mm"),
      content: messageContent,
      type: "text",
    };

    addMessage(message, id);
    broadcastMessage(message, id);

    if (!callback) return;
    callback(message, id);
  }

  function broadcastMessage(message: TMessage, id = "") {
    socket.to(id).emit("receiveMessage", { id, message });
  }

  function onDeleteAllChats() {
    deleteAllChats();
    io.emit("allChatsDeleted");
  }
};

export { onSocketConection };
