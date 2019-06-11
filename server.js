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
// Configure middleware

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

// Start server
app.listen(PORT, function () {
    // Log listening
    console.log("Server listening on: http://localhost:" + PORT);
});