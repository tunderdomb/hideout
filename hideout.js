var path = require("path")
var fs = require("fs")
var async = require("async")
var mkdirp = require("mkdirp")
var glob = require("glob")
var inquirer = require("inquirer")

var cwd = process.cwd()

function toCwd( src ){
  return path.join(cwd, src)
}

function read( src ){
  try {
    return fs.readFileSync(src, "utf8")
  }
  catch ( e ) {
    return null
  }
}

function readJSON( src ){
  try {
    return JSON.parse(read(src))
  }
  catch ( e ) {
    return null
  }
}

var hideout = module.exports = {}

hideout.collectHideouts = function(  ){

}

/**
 * Operations scoped to the template files
 * */
var hide = hideout.hide = {}

/**
 * Read files from the hideout
 * @param src {String} a globbing pattern
 * @param [options]{Object}
 *
 * @return File[]
 * */
hide.read = function( src, options ){
  var files = glob.sync("**/*.js", {
    cwd: cwd
  }).map(function( src ){
    return {
      src: src,
      content: read(src)
    }
  })
  if( options.rename ) files = files.map(function( file ){
    options.rename(file.src, file.content)
  })
  if( options.process ) files = files.map(function( file ){
    options.process(file.src, file.content)
  })
  return files
}

/**
 * Run a command with the hide dir as cwd.
 * */
hide.run = function ( command, done ){

}

/**
 * Operations scoped to the dest/cwd
 * */
var out = hideout.out = {}

out.prompt = inquirer

/**
 * Write into the target dir
 * @param files {File[]}
 * @param [options] {Object}
 * */
out.write = function ( files, options ){
  files.forEach(function( file ){
    fs.writeFileSync(file.src, file.content, options)
  })
}

/**
 * Run a command with the target dir as cwd
 * */
out.run = function ( command, done ){

}