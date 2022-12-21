import {
  ServerToClientEvents,
  TChat,
  TMessage,
  TTemplate,
} from "../Types/Types";
import {
  addMessage,
  setChatStatus,
  createNewChat,
  deleteAllChats,
  fetchChatData,
  getAllChats,
} from "./chatsController";
import {
  createTemplate,
  deleteTemplate,
  getAllTemplates,
  updateTemplate,
} from "./templatesController";
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
  socket.on("updateTemplate", onUpdateTemplate);
  socket.on("deleteTemplate", onDeleteTemplate);
  socket.on("getAllTemplates", onGetAllTemplates);
  socket.on("createTemplate", onCreateTemplate);

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

  async function onUpdateTemplate(tempalte: TTemplate) {
    await updateTemplate(tempalte);
  }

  async function onDeleteTemplate(tempalteId: string) {
    await deleteTemplate(tempalteId);
  }

  async function onGetAllTemplates(callback: (list: Array<TTemplate>) => void) {
    const list = await getAllTemplates();
    callback(list);
  }

  async function onCreateTemplate(
    { title, content }: { title: string; content: string },
    callback: (template: TTemplate) => void
  ) {
    const tempalte = await createTemplate(title, content);
    callback(tempalte);
  }
};

export { onSocketConection };
