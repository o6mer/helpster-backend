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
    callback(allChats);
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
    callback: (message: TMessage) => void
  ) {
    const message: TMessage = {
      writer: user || "costumer",
      time: date.format(new Date(), "HH:mm"),
      content: messageContent,
      type: "text",
    };

    const emitMessageTo = user ? "one" : "all";

    addMessage(message, id);
    broadcastMessage(message, id, emitMessageTo);

    if (!callback) return;
    callback(message);
  }

  function broadcastMessage(message: TMessage, id = "", emitMessageTo: string) {
    // io.emit("receiveMessage", { id, message });
    if (emitMessageTo === "all") io.emit("receiveMessage", { id, message });
    else io.to(id).emit("receiveMessage", { id, message });
  }

  function onDeleteAllChats() {
    deleteAllChats();
    io.emit("allChatsDeleted");
  }
};

export { onSocketConection };
