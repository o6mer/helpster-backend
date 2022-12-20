import { TTemplate } from "../Types/Types";
const { Template } = require("../models/templateModel");
const { v4: uuidv4 } = require("uuid");

const getAllTemplates = async () => {
  try {
    const list = await Template.find({});
    return list;
  } catch (err) {
    console.log(err);
  }
};

const createTemplate = async (title: string, content: string) => {
  try {
    const template = new Template({ title, content, id: uuidv4() });
    return await template.save();
  } catch (err) {
    console.log(err);
  }
};

const updateTemplate = async (template: TTemplate) => {
  try {
    const { title, content, id } = template;
    const updatedTemplate = await Template.findOne({ id });
    if (!updatedTemplate) return;
    //  new Template({ title, content, id: uuidv4() });
    updatedTemplate.title = title;
    updatedTemplate.content = content;

    return await updatedTemplate.save();
  } catch (err) {
    console.log(err);
  }
};

const deleteTemplate = async (tempalteId: string) => {
  try {
    return await Template.deleteOne({ id: tempalteId });
  } catch (err) {
    console.log(err);
  }
};

export { getAllTemplates, updateTemplate, deleteTemplate, createTemplate };
