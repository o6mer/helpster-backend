type TMessage = {
  writer: string;
  time: string;
  content: string;
  type: string;
};

const onSocketConection = (socket: any, io: any) => {
  socket.on("newConnection", () => {
    broadcastMessage({
      writer: "Admin",
      time: new Date().getDate().toString(),
      type: "input",
      content: "What is your name?",
    });
  });

  socket.on("sendMessage", (message: TMessage) => {
    broadcastMessage(message, "user");
  });

  const broadcastMessage = (message: TMessage, to = "") => {
    if (to === "") socket.emit("recieveMessage", message);
    else socket.to(to).emit("recieveMessage", message);
  };
};

export { onSocketConection };
