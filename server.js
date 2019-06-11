const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Start server
app.listen(PORT, function () {
    // Log listening
    console.log("Server listening on: http://localhost:" + PORT);
});