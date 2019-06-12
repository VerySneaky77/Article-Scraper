const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");
// Require all models
const db = require("./models");
// Set port
const PORT = process.env.PORT || 8080;

// Initialise app
const app = express();

// ====================
// Configure middleware
// ====================

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make 'public' a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// ======
// Routes
// ======

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // Success
        res.json(dbArticle);
      })
      .catch(function(err) {
        // No-go
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's comments
  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      // Populate the chosen one
      .populate("comment")
      .then(function(dbArticle) {
        // Success
        res.json(dbArticle);
      })
      .catch(function(err) {
        // No-go
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new comment and pass the req.body to the entry
    db.Comment.create(req.body)
      .then(function(dbComment) {
        // Successful new comment, find and pair with appropriate article
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
      })
      .then(function(dbArticle) {
        // Success
        res.json(dbArticle);
      })
      .catch(function(err) {
        // No-go
        res.json(err);
      });
  });

// Start server
app.listen(PORT, function () {
    // Log listening
    console.log("Server listening on: http://localhost:" + PORT);
});