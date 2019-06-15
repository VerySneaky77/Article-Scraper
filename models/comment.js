const mongoose = require("mongoose");

// Schema constructor
const Schema = mongoose.Schema;

// New schema constructor for comments
const CommentSchema = new Schema({
  title: String,
  body: String
});

// Comment schema
var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
