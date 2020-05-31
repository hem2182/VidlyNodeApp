const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
require("dotenv").config();

const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const logger = require("./logger");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

app.set("view engine", "pug");
app.set("views", "./views");

// Configuration
console.log("Application Name " + config.get("name"));
console.log("Application Mail Server " + config.get("mail.host"));
console.log("Application Mail Password: " + config.get("mail.password"));

// enabling DEBUG logic
const debugValue = process.env.DEBUG;
if (debugValue === "app:startup") {
  startupDebugger.enabled = true;
} else if (debugValue === "app:db") {
  dbDebugger.enabled = true;
} else if (debugValue === "all" || debugValue === "app:*") {
  dbDebugger.enabled = true;
  startupDebugger.enabled = true;
} else if (debugValue === "None") {
  dbDebugger.enabled = false;
  startupDebugger.enabled = false;
}

if (app.get("env") === "development") {
  startupDebugger("Morgan Enabled...");
  app.use(morgan("tiny"));
}

// DB Work.
dbDebugger("Connected to the Database...");

app.use(logger);

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Horror" },
  { id: 3, name: "Romance" },
];

app.get("/api/genres", (req, res) => {
  // res.send(genres);
  res.render("index", {
    title: "Vidly Video Rental App",
    message: "Hi Folks. ",
  });
});

app.post("/api/genres", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  genres.push(genre);
  res.send(genre);
});

app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

app.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
