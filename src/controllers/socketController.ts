type TMessage = {
  writer: string;
  time: string;
  content: string;
};

const onSocketConection = (socket: any, io: any) => {
  socket.on("sendMessage", (message: TMessage) => {
    socket.broadcast.emit("recieveMessage", message);
  });
};

export { onSocketConection };
