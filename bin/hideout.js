#!/usr/bin/env node

var path = require("path")
var hideout = require("../hideout")

var ENTRY_SCRIPT = "hideout.js"

var cwd = process.cwd()
var hideoutFile = path.join(cwd, ENTRY_SCRIPT)

try {
  var task = hideout.arguments._[0]
  if (task) {
    hideout.arguments._.shift()
  }

  require(hideoutFile)

  if (task) {
    if (hideout.tasks.hasTask(task)) {
      hideout.tasks.start(task)
    }
    else {
      console.log("No such task")
    }
  }
}
catch (e) {
  console.error("Missing/invalid %s in %s", ENTRY_SCRIPT, cwd)
  throw e
}
