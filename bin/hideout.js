#!/usr/bin/env node

var path = require("path")
var cwd = process.cwd()
var argv = require("minimist")(process.argv.slice(2))
var hideout = require("../hideout")

var hideoutFile = path.join(cwd, "hideout.js")

try {
  require(hideoutFile)(hideout, argv)
}
catch (e) {
  console.error(e)
}

var task = argv._[0]
if (hideout.tasks.hasTask(task)) {
  hideout.tasks.start(task)
}
else {
  console.log("No such task")
}
