#!/usr/bin/env node

var cwd = process.cwd()
var argv = require('minimist')(process.argv.slice(2))

var hideout = require("../hideout")

var task = require(argv._[0])

