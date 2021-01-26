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

// View Routes -------------------

app.get("/", (req, res) => {
  var queryString = `SELECT * FROM MOVIES
  `;
  connection.query(queryString, function (err, data) {
    res.render("index", { movies: data });
  });
});
app.get("/movies/new", (req, res) => {
  res.render("newMovie");
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
  const id = req.params.id;
  connection.query(
    "SELECT * FROM movies WHERE id=?",
    [id],
    function (err, data) {
      res.render("editMovie", data[0]);
    }
  );
});


// Create API Route ---------------
app.post("/api/movies", (req, res) => {
  const movie = req.body.movie;
  const queryString = "INSERT INTO movies (movie) VALUES (?);";
  connection.query(queryString, [movie], function (err, result) {
    res.json(result);
  });
});
// Update API Route --------------
app.put("/api/movies/:id", (req, res) => {
  const movie = req.body.movie;
  const id = req.params.id;
  const queryString = "UPDATE movies SET movie = (?) WHERE id = ?";
  connection.query(queryString, [movie, id], function (err, result) {
    res.json(result);
  });

});
// Delete API Route ----------------
app.delete("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;
  const queryString = "DELETE FROM movies WHERE id = ?;";
  connection.query(queryString, [movieId], function (err, result) {
    res.json(result);
  });
});

app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});
