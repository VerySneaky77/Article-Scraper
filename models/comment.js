const mongoose = require("mongoose");

// Schema constructor
const Schema = mongoose.Schema;

// New schema constructor for comments
const CommentSchema = new Schema({
  body: String
});

// Comment schema
var Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;
