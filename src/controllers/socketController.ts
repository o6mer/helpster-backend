import { chatsSocketController } from "./socket-controllers/chats";
import { conversationsSocketController } from "./socket-controllers/conversations";
import { templatesSocketController } from "./socket-controllers/templates";
import { usersSocketController } from "./socket-controllers/users";

const onSocketConection = (socket: any, io: any) => {
  usersSocketController(io, socket);
  chatsSocketController(io, socket);
  templatesSocketController(io, socket);
  conversationsSocketController(io, socket);
};

export { onSocketConection };
