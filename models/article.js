const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// New schema construction
const ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  save: {
    type: Boolean,
    required: true,
    default: false
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: "comment"
  }
});

// Article mongoose model
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;