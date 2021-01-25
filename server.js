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
  var queryString = `SELECT * FROM MOVIES
  `;
  connection.query(queryString, function (err, data) {
    if (err) {
      return res.status(500).end();
    }
    res.render("index", { movies: data });
  });
});

app.get("/movies/:id", (req, res) => {
  const movieId = req.params.id;
  connection.query(
    `
  SELECT * FROM movies
  WHERE id = ?`,
    [movieId],
    (err, data) => {
      // sending back handlebars page and 'id' data from the object
      res.render("singleMovie", data[0]);
    }
  );
});
app.get("/movies/:id/edit", (req, res) => {
  connection.query(
    `UPDATE movies
  SET movie = "Go"
  WHERE id = 10`,
    [],
    (err, data) => {}
  );
  res.send("form to edit new movie here");
});

app.get("/movies/new", (req, res) => {
  res.send("form to add new movie");
});

// API Routes
// Create
app.post("/api/movies", (req, res) => {
  res.send("after creating a new movie in the DB, I will return a response");
});
// Update
app.put("/api/movies/:id", (req, res) => {
  res.send("after updating a movie by ID, I will return a response");
});
// Delete
app.delete("/api/movies/:id", (req, res) => {
  res.send("after deleting a movie by id, I will return a response");
});

app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
