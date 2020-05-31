require("dotenv").config();
const { startupDebugger, dbDebugger } = require("./middleware/debuggerConfig");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const logger = require("./middleware/logger");
const genres = require("./routes/genres");
const home = require("./routes/home");
const express = require("express");
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

// logger
app.use(logger);

// routes
app.use("/api/genres", genres);
app.use("/", home);

// view engine
app.set("view engine", "pug");
app.set("views", "./views");

// Configuration
console.log("Application Name " + config.get("name"));
console.log("Application Mail Server " + config.get("mail.host"));
console.log("Application Mail Password: " + config.get("mail.password"));

// environments
if (app.get("env") === "development") {
  startupDebugger("Morgan Enabled...");
  app.use(morgan("tiny"));
}

// DB Work.
dbDebugger("Connected to the Database...");

// listener
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
