const mongoose = require("mongoose");

// Schema constructor
const Schema = mongoose.Schema;

// New schema constructor for comments
const CommentSchema = new Schema({
  title: String,
  body: String,
  article: {
    type: Schema.Types.ObjectId,
    ref: "article"
  }
});

// Comment schema
var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
