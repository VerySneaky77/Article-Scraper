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

// Set Handlebars
// Due to handlebar views not rendering content, this feature has been disabled
// const exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// ======
// Routes
// ======

// A GET route for scraping the Fox video games news website
app.get("/scrape", function(req, res) {
  axios.get("https://www.foxnews.com/category/tech/topics/video-games").then(function(response) {
    // Load into cheerio
    var $ = cheerio.load(response.data);

    // Select article tags
    $("article.article-list div.info").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link
      result.title = $(this)
        .children("header.info-header")
        .children("h4.title")
        .children("a")
        .text();
      result.link = $(this)
        .children("header.info-header")
        .children("h4.title")
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/", function(req, res) {
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

// Route for getting saved Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({ where: {reserveMe : true }})
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
  
  // Route for saving/updating an Article's associated Comment
  app.post("/articles/:id", function(req, res) {
    db.Comment.create(req.body)
      .then(function(dbComment) {
        // Successful new comment, find and pair with appropriate article
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
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