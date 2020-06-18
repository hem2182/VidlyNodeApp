function log(req, res, next) {
  console.log("Logging from logger middleware...");
  next();
}

module.exports = log;
