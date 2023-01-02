import { TChat, TMessage } from "../../Types/Types";
import {
  addMessage,
  deleteAllChats,
  fetchChatData,
  getAllChats,
  setChatStatus,
} from "../chatsController";
const date = require("date-and-time");

export const chatsSocketController = (io: any, socket: any) => {
  socket.on("sendMessage", onSendMessage);
  socket.on("getChatData", getChatData);
  socket.on("deleteAllChats", onDeleteAllChats);
  socket.on("joinChat", onJoinChat);
  socket.on("setChatStatus", onSetChatStatus);
  socket.on("getFilteredChatList", onGetFilteredChatList);

  async function getChatData(id: string, callback: (chat: TChat) => void) {
    const chatData = await fetchChatData(id);
    socket.join(id);
    callback(chatData);
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
      writer: user || "Customer",
      time: date.format(new Date(), "HH:mm"),
      content: messageContent,
      type: "text",
    };

    addMessage(message, id);
    broadcastMessage(message, id);

    if (!callback) return;
    callback(message, id);
  }

  async function onSetChatStatus(status: string, chatId: string) {
    const chat = await setChatStatus(status, chatId);
    socket.join(chatId);
    io.emit("chatStatusChanged", chat);
  }

  function broadcastMessage(message: TMessage, id = "") {
    socket.to(id).emit("receiveMessage", { id, message });
  }

  function onDeleteAllChats() {
    deleteAllChats();
    io.emit("allChatsDeleted");
  }

  async function onGetFilteredChatList(
    filter: string,
    callback: (list: Array<TChat>) => void
  ) {
    const list = await getAllChats(filter);
    callback(list);
  }
};
