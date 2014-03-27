var path = require("path")
var exec = require("child_process").exec
var fs = require("fs")
var async = require("async")
var mkdirp = require("mkdirp")
var glob = require("glob")
var inquirer = require("inquirer")

var cwd = process.cwd()

module.exports = function ( plugin ){
  switch ( plugin ) {
    case "hideout":
    case "Gruntplugin":
    case "npm-module":
      require(path.join(__dirname, "builtins/" + plugin + "/hideout.js"))(new Hideout())
      break
    default:
      require(plugin)(new Hideout())
  }
}

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

function extend( obj, ext ){
  for ( var prop in ext ) {
    obj[prop] = ext[prop]
  }
}

function Hideout(){
  this.q = []
  this.options = {}
  this.current = 0
}

Hideout.prototype = {}

Hideout.prototype.start = function ( done ){
  this.done = done
  this.next()
}

Hideout.prototype.next = function (){
  if ( this.q.length ) {
    this.q.shift()(this)
  }
  else {
    this.done(this.options)
  }
}

Hideout.prototype.queue = function ( filter, task ){
  this.q.push(function ( H ){
    if ( !filter || filter && filter(H.options) ) task(function (){
      H.next()
    })
  })
  return this
}

Hideout.prototype.log = function ( msg, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    console.log(msg)
    done()
  })
}

Hideout.prototype.warn = function ( msg, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    console.warn(msg)
    done()
  })
}

Hideout.prototype.prompt = function ( questions, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    inquirer.prompt(questions, function ( answers ){
      extend(H.options, answers)
      done()
    })
  })
}

Hideout.prototype.ask = function ( questions, filter ){
  var H = this
  questions.type = "input"
  return this.queue(filter, function ( done ){
    inquirer.prompt(questions, function ( answers ){
      extend(H.options, answers)
      done()
    })
  })
}

Hideout.prototype.confirm = function ( questions, filter ){
  var H = this
  questions.type = "confirm"
  return this.queue(filter, function ( done ){
    inquirer.prompt(questions, function ( answers ){
      extend(H.options, answers)
      done()
    })
  })
}

Hideout.prototype.select = function ( questions, filter ){
  var H = this
  questions.type = "list"
  return this.queue(filter, function ( done ){
    inquirer.prompt(questions, function ( answers ){
      extend(H.options, answers)
      done()
    })
  })
}

Hideout.prototype.selectMultiple = function ( questions, filter ){
  var H = this
  questions.type = "checkbox"
  return this.queue(filter, function ( done ){
    inquirer.prompt(questions, function ( answers ){
      extend(H.options, answers)
      done()
    })
  })
}

/**
 * @param src{String} source files globbing pattern
 * @param dest{String} dest directory path
 * @param [filter]{String} filter callback
 * */
Hideout.prototype.copy = function ( src, dest, filter ){
  return this.queue(filter, function ( done ){
    glob(src, {}, function ( err, files ){
      async.each(files, function ( file, next ){
        fs.rename(file, dest, function ( err ){
          next()
        })
      }, done)
    })
  })
}

Hideout.prototype.process = function ( src, dest, process, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    done()
  })
}

Hideout.prototype.read = function ( src, process, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    done()
  })
}

Hideout.prototype.readJSON = function ( src, process, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    done()
  })
}

Hideout.prototype.make = function ( dirs, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    async.each(dirs, function ( dir, next ){
      mkdirp(dir, next)
    }, done)
  })
}

Hideout.prototype.run = function ( cmd, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    done()
  })
}

Hideout.prototype.run = function ( cmd, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    exec(cmd, function ( err, stdout, stderr ){
      console.log(stdout)
      console.log(stderr)
      if ( err !== null ) {
        console.log('exec error: ' + err)
      }
      done()
    })
  })
}

Hideout.prototype.package = function ( json, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    fs.writeFile(toCwd("package.json"), JSON.stringify(json, null, "  "), function( err ){
      done()
    })
  })
}

Hideout.prototype.npmInstall = function ( packages, options, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    var cmd = "npm install"
      + (packages.length ? " " + packages.join(" ") : "")
      + (options ? " " + options : "")
    exec(cmd, function ( err, stdout, stderr ){
      console.log(stdout)
      console.log(stderr)
      if ( err !== null ) {
        console.log('exec error: ' + err)
      }
      done()
    })
  })
}

Hideout.prototype.gitInit = function ( options, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    var cmd = "git init"
      + (options || "")
    exec(cmd, function ( err, stdout, stderr ){
      console.log(stdout)
      console.log(stderr)
      if ( err !== null ) {
        console.log('exec error: ' + err)
      }
      done()
    })
  })
}
