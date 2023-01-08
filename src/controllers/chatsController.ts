import { TMessage } from "../Types/Types";
import { onlineAdmins } from "./socket-controllers/users";
const { Chat } = require("../models/chatModel");
const { v4: uuidv4 } = require("uuid");
const date = require("date-and-time");

export const createNewChat = async () => {
  try {
    const currentTime = date.format(new Date(), "DD/MM/YYYY HH:mm:ss");
    const assignedAdmin = await findAvilableAdmin();
    const newChat = new Chat({
      id: uuidv4(),
      creationTime: currentTime,
      assignedAdmin,
    });
    const savedChat = await newChat.save();
    return savedChat;
  } catch (err) {
    console.log(err);
  }
};

export const findAvilableAdmin = async () => {
  try {
    if (!onlineAdmins.length) return;

    const currentAssigments = await Chat.find({}, "assignedAdmins");
    const counter: { [k: string]: number } = {};
    currentAssigments.forEach(
      (chat: { _id: any; assignedAdmins: Array<string> }) => {
        chat.assignedAdmins.forEach((id: string) => {
          if (!counter[id]) return (counter[id] = 1);
          counter[id]++;
        });
      }
    );
    const min = Math.min(...Object.values(counter));
  } catch (err) {
    console.log(err);
  }
};

export const addMessage = async (message: TMessage | undefined, id: string) => {
  try {
    const chat = await Chat.findOne({ id });

    if (!chat) return;

    chat.messages.push(message);
    const updatedChat = await chat.save();
    return updatedChat;
  } catch (err) {
    console.log(err);
  }
};

export const getAllChats = async (filter?: string) => {
  try {
    const allChats = await Chat.find(filter ? { status: filter } : {});
    return allChats;
  } catch (err) {
    console.log(err);
  }
};

export const fetchChatData = async (id: string) => {
  try {
    const chat = await Chat.findOne({ id });
    if (!chat) return;
    chat.isOpen = true;
    await chat.save();
    return chat;
  } catch (err) {
    console.log(err);
  }
};

export const deleteAllChats = async () => {
  try {
    await Chat.deleteMany({});
  } catch (err) {
    console.log(err);
  }
};

export const setChatStatus = async (status: string, chatId: string) => {
  try {
    const chat = await Chat.findOne({ id: chatId });
    if (!chat) return;
    chat.status = status;
    return await chat.save();
  } catch (err) {
    console.log(err);
  }
};
