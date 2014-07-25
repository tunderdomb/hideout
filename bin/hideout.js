#!/usr/bin/env node

var path = require("path")
var cwd = process.cwd()
var argv = require('minimist')(process.argv.slice(2))
var hideout = require("../hideout")

var plugin = argv._[0]
var hideoutScript = plugin
  ? path.join(cwd, "node_modules", plugin, "hideout.js")
  : path.join(cwd, "hideout.js")
var hideoutModule = null

try{
  hideoutModule = require(hideoutScript)
}
catch( e ){
  console.error("This is not a hideout! (%s)", hideoutScript)
}
if( typeof hideoutModule == "function" ) {
  hideoutModule(hideout(argv))
}
