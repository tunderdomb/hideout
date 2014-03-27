#!/usr/bin/env node

var path = require("path")
var glob = require("glob")
var cwd = process.cwd()
var argv = require('minimist')(process.argv.slice(2))
var inquirer = require("inquirer")
var async = require("async")

var hideout = require("../hideout")

var task = argv._[0]

if( task ) hideout(task)
else {
  async.concat([
    path.join(__dirname, "../builtins/*/"),
    path.join(cwd, "../node_modules/hideout-*/"),
    path.join(__dirname, "../../hideout-*/")
  ], function( pattern, next ){
    glob(pattern, {}, function( err, files ){
      next(null, files.map(function( plugin ){
        return path.basename(plugin)
      }))
    })
  }, function( err, plugins ){
    inquirer.prompt([{
      type: "list",
      name: "plugin",
      message: "Select a plugin",
      default: plugins[0],
      choices: plugins
    }], function( options ){
      hideout(options.plugin)
    })
  })
}