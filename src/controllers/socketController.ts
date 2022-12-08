type TMessage = {
  writer: string;
  time: string;
  content: string;
  type: string;
};

const onSocketConection = (socket: any, io: any) => {
  socket.on("newUserConnection", onNewUserConnection);
  socket.on("sendMessage", onSendMessage);

  function onNewUserConnection() {
    broadcastMessage({
      writer: "Admin",
      time: new Date().getDate().toString(),
      type: "input",
      content: "What is your name?",
    });
  }

  function onSendMessage(message: TMessage) {
    broadcastMessage(message, "user");
  }

  function broadcastMessage(message: TMessage, to = "") {
    if (to === "") socket.emit("recieveMessage", message);
    else socket.to(to).emit("recieveMessage", message);
  }
};

export { onSocketConection };
