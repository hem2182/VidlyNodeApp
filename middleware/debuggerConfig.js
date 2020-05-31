const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

function debuggerConfig() {
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
}

module.exports = {startupDebugger: startupDebugger, dbDebugger: dbDebugger}