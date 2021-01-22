const express = require("express");
const mysql = require("mysql");
const exphbs = require("express-handlebars");

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "trapstar",
  database: "moviePlannerDB",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

// view routes
app.get("/", (req, res) => {
  res.send("all my movies go here");
});
app.get("/movies/:id", (req, res) => {
  res.send("single movie goes here");
});
app.get("/movies/:id/edit", (req, res) => {
  res.send("form to update movie here");
});
app.get("/movies/new", (req, res) => {
  res.send("aform to create new movie here");
});


// API Routes

app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
