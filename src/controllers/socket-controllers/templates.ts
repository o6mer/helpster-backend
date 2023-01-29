import { TTemplate } from "../../Types/Types";
import {
  createTemplate,
  deleteTemplate,
  getAllTemplates,
  updateTemplate,
} from "../templatesController";

export const templatesSocketController = (io: any, socket: any) => {
  socket.on("updateTemplate", onUpdateTemplate);
  socket.on("deleteTemplate", onDeleteTemplate);
  socket.on("getAllTemplates", onGetAllTemplates);
  socket.on("createTemplate", onCreateTemplate);

  async function onUpdateTemplate(tempalte: TTemplate) {
    await updateTemplate(tempalte);
  }

  async function onDeleteTemplate(tempalteId: string) {
    await deleteTemplate(tempalteId);
  }

  async function onGetAllTemplates(callback: (list: Array<TTemplate>) => void) {
    const list = await getAllTemplates();
    callback(list);
  }

  async function onCreateTemplate(
    { title, content }: { title: string; content: string },
    callback: (template: TTemplate) => void
  ) {
    const tempalte = await createTemplate(title, content);
    callback(tempalte);
  }
};
