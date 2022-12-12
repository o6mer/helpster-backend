import { TMessage } from "../Types/Types";

const { Chat } = require("../models/chatModel");
const { v4: uuidv4 } = require("uuid");

export const createNewChat = async () => {
  try {
    const newChat = new Chat({ id: uuidv4() });
    const savedChat = await newChat.save();
    return savedChat;
  } catch (err) {
    console.log(err);
  }
};

export const addMessage = async (message: TMessage, id: string) => {
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

export const getAllChats = async () => {
  try {
    const allChats = await Chat.find({});
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
