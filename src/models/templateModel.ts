const mongoose = require("mongoose");

const tempalteSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, unique: true },
  content: String,
});

const Template = mongoose.model("Template", tempalteSchema);

export { Template };
