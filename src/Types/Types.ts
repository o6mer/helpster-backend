export type TChat = {
  _id: string;
  costumer: { id: string; name?: string };
  isOpen: boolean;
  messages: Array<TMessage>;
  creationTime: Date;
};

export type TMessage = {
  writer: string;
  time: Date | string;
  type: string;
  content?: any;
  children?: any;
};
