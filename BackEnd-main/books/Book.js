const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  page: { type: Number, required: true },
  code: { type: String, required: true },
});

module.exports = mongoose.model("Book", bookSchema);
