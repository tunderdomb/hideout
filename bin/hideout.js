#!/usr/bin/env node

var path = require("path")
var glob = require("glob")
var cwd = process.cwd()
var argv = require('minimist')(process.argv.slice(2))
var inquirer = require("inquirer")

var hideout = require("../hideout")

var task = argv._[0]

if( task ) hideout(task)
else glob(path.join(__dirname, "../builtins/*/"), {}, function ( err, builtins ){
  glob(path.join(__dirname, "../../hideout-*/"), {}, function ( err, plugins ){
    plugins = ["Built in plugins", new inquirer.Separator()]
      .concat(builtins)
      .concat(["", "Custom plugins", new inquirer.Separator()])
      .concat(plugins)
      .map(function( plugin ){
        return path.basename(plugin)
      })
    inquirer.prompt([{
      type: "list",
      name: "plugin",
      message: "Select a plugin",
      default: "hideout",
      choices: plugins
    }], function( options ){
      hideout(options.plugin)
    })
  })
})