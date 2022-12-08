const { Chat } = require("../models/chatModel");

export const createNewChat = async () => {
  try {
    const newChat = new Chat();
    const savedChat = await newChat.save();
    console.log(savedChat);
    return savedChat;
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
    return await Chat.findById(id);
  } catch (err) {
    console.log(err);
  }
};
