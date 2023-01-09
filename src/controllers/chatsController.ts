import { User } from "../models/userModel";
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

    const currentAssigments = await Chat.find({}, "assignedAdmin");
    console.log(currentAssigments);
    const counter: { [k: string]: number } = {};
    currentAssigments.forEach((chat: { _id: any; assignedAdmin: string }) => {
      if (!counter[chat.assignedAdmin])
        return (counter[chat.assignedAdmin] = 1);
      counter[chat.assignedAdmin]++;
    });

    console.log(counter);

    if (Object.keys(counter.length === 0)) {
      const { username } = await User.findOne(
        { username: onlineAdmins[0] },
        "username"
      );

      return username;
    }

    const enteries = Object.entries(counter);
    const loweset = {
      sum: enteries[0][1],
      username: "",
    };

    enteries.forEach((array: Array<any>) => {
      if (array[1] <= loweset.sum) {
        loweset.sum = array[1];
        loweset.username = array[0];
      }
    });

    const { username } = await User.findOne(
      { username: onlineAdmins[0] },
      "username"
    );

    return username;
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
