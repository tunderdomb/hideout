#!/usr/bin/env node

var path = require("path")
var cwd = process.cwd()
var async = require("async")
var argv = require("minimist")(process.argv.slice(2))
var hideout = require("../hideout")

var plugin = argv._[0]
// project hideout
var localHideout = path.join(cwd, "hideout.js")
var installedHideouts = [
  // local hideouts
  path.join(cwd, "node_modules/hideout-" + plugin + "/hideout.js"),
  // global hideouts
  path.join(__dirname, "../../hideout-" + plugin + "/hideout.js")
]

function runHideout(name) {
  try {
    var hideoutModule = require(name)
    if (typeof hideoutModule == "function") {
      hideoutModule(hideout(argv))
    }
    return true
  }
  catch (e) {
    if (e.code == "MODULE_NOT_FOUND") {
      console.error("This is not a hideout! (%s)", name)
    }
    else {
      console.log("This hideout is broken", e)
    }
    return false
  }
}

if (plugin) {
  // search for the plugin
  async.any(installedHideouts, function(installedHideout, next) {
    next(runHideout(installedHideout))
  }, function(any) {
    if (!any) console.log("Nothing happened!")
  })
}
else {
  // run the project hideout
  runHideout(localHideout)
}
