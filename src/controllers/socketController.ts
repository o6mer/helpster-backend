import { TChat, TMessage } from "../Types/Types";
import {
  addMessage,
  setChatStatus,
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
  socket.on("setChatStatus", onSetChatStatus);
  socket.on("getFilteredChatList", onGetFilteredChatList);

  async function getChatData(id: string, callback: (chat: TChat) => void) {
    const chatData = await fetchChatData(id);
    socket.join(id);
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
    const allChats = await getAllChats("open");
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

export { onSocketConection };
