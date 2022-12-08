import { TChat, TMessage } from "../Types/Types";
import { createNewChat, fetchChatData, getAllChats } from "./chatsController";

const onSocketConection = (socket: any, io: any) => {
  socket.on("sendMessage", onSendMessage);
  socket.on("newUserConnection", onNewUserConnection);
  socket.on("newAdminConnection", onNewAdminConnection);
  socket.on("getChatData", getChatData);

  async function getChatData(id: string, callback: (chat: TChat) => void) {
    const chatData = await fetchChatData(id);
    callback(chatData);
  }

  async function onNewUserConnection() {
    const newChat = await createNewChat();

    socket.emit("newChatStarted", newChat);

    broadcastMessage({
      writer: "Admin",
      time: new Date().getDate().toString(),
      type: "input",
      content: "What is your name?",
    });
  }

  async function onNewAdminConnection(callback: (list: Array<any>) => void) {
    const allChats = await getAllChats();
    callback(allChats);
  }

  function onSendMessage({
    id,
    messageContent,
  }: {
    id: string;
    messageContent: string;
  }) {
    const message: TMessage = {
      writer: id,
      time: `${new Date().getHours()}: ${new Date().getMinutes()}`,
      content: messageContent,
      type: "text",
    };

    console.log(message);
    broadcastMessage(message, id);
  }

  function broadcastMessage(message: TMessage, id = "") {
    io.emit("receiveMessage", { id, message });
    // if (to === "") socket.emit("recieveMessage", message);
    // else socket.to(to).emit("recieveMessage", message);
  }
};

export { onSocketConection };
