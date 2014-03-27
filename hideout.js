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

Hideout.prototype.start = function ( dir, done ){
  this.pluginDir = dir
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
 * @param options{Object}
 * @param [filter]{Function}
 * @param options.src{String} glob pattern for files to copy/process
 * @param [options.dest]{String} destination path. Default: ""
 * @param [options.flatten]{String} remove directory parts from files
 * @param [options.rename]{String} overwrite file path
 * @param [options.process]{String} process file along the way
 * */
Hideout.prototype.copy = function ( options, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    var dest = options.dest || ""
    // collect files
    glob(options.src, {
      cwd: H.pluginDir
    }, function ( err, files ){
      // iterate them
      async.each(files, function ( file, next ){
        // dest path for current file
        var target = path.join(cwd, dest, file)
        // src path for current
        file = path.join(H.pluginDir, file)
        // flatten
        if ( options.flatten ) {
          target = path.join(cwd, dest, path.basename(file))
        }
        // rename
        if ( options.rename ) {
          target = options.rename(target)
        }
        // process
        if ( options.process ) {
          console.log("Process:", file, "->", target)
          mkdirp(path.dirname(target), function(  ){
            fs.readFile(file, "utf8", function( err, data ){
              fs.writeFile(target, options.process(data), "utf8")
              next()
            })
          })
        }
        // copy
        else {
          console.log("Copy:", file, "->", target)
          mkdirp(path.dirname(target), function(  ){
            fs.createReadStream(file)
              .pipe(fs.createWriteStream(target))
            next()
          })
        }
      }, done)
    })
  })
}

Hideout.prototype.read = function ( src, process, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    fs.readFile(src, "utf8", function( err, data ){
      process(err, data, H.options, done)
    })
  })
}

Hideout.prototype.readJSON = function ( src, process, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    fs.readFile(src, "utf8", function( err, data ){
      try{
        process(err, JSON.parse(data), H.options, done)
      }
      catch ( e ){
        process(e, null, H.options, done)
      }
    })
  })
}

Hideout.prototype.writeJSON = function ( dest, obj, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    console.log("Write JSON:", dest)
    fs.writeFile(path.join(cwd, dest), JSON.stringify(obj, null, "  "), function( err ){
      done()
    })
  })
}

Hideout.prototype.make = function ( dirs, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    async.each(dirs, function ( dir, next ){
      console.log("Make dir:", dir)
      mkdirp(dir, next)
    }, done)
  })
}

Hideout.prototype.run = function ( cmd, result, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    console.log("Executing: ", "'"+cmd+"'")
    exec(cmd, function ( err, stdout, stderr ){
      result(err, stdout, stderr)
      done()
    })
  })
}

Hideout.prototype.runBatch = function ( commands, result, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    async.each(commands, function( cmd, next ){
      console.log("Executing: ", "'"+cmd+"'")
      exec(cmd, function ( err, stdout, stderr ){
        result(err, stdout, stderr)
        next()
      })
    }, done)
  })
}

Hideout.prototype.package = function ( json, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    console.log("Write package.json..")
    fs.writeFile(path.join(cwd, "package.json"), JSON.stringify(json, null, "  "), function( err ){
      done()
    })
  })
}

/**
 * @param packages{String[]}
 * @param [options]{Object}
 * @param [filter]{Function}
 * */
Hideout.prototype.npmInstall = function ( packages, options, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    var cmd = "npm install"
      + (packages.length ? " " + packages.join(" ") : "")
      + (options ? " " + options : "")
    console.log("Installing npm modules: ", packages.join(" "))
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
    console.log("Initializing git repository..")
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
