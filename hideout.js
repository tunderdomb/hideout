var path = require("path")
var exec = require("child_process").exec
var fs = require("fs")
var async = require("async")
var mkdirp = require("mkdirp")
var glob = require("glob")
var inquirer = require("inquirer")
var chalk = require("chalk")

var cwd = process.cwd()

var hideout = module.exports = {}

hideout.plug = function ( plugin, argv ){
  glob(path.join(__dirname, "builtins/*"), {}, function ( err, plugins ){
    plugins.some(function ( src ){
      if ( path.basename(src) == plugin ) {
        plugin = path.join(src, "hideout.js")
        return true
      }
      return false
    })
    require(plugin)(new Hideout(null, argv))
  })
}

hideout.log = function (){
  console.log.apply(console, ["hideout"].concat([].slice.call(arguments)))
}
hideout.warn = function (){
  console.warn.apply(console, ["hideout", chalk.bgYellow.black("WARN")].concat([].slice.call(arguments)))
}
hideout.error = function (){
  console.error.apply(console, ["hideout", chalk.bgRed.black("ERROR")].concat([].slice.call(arguments)))
}
hideout.ok = function (){
  console.log.apply(console, ["hideout", chalk.green("OK")].concat([].slice.call(arguments)))
}

hideout.extend = function ( obj, ext ){
  for ( var prop in ext ) {
    obj[prop] = ext[prop]
  }
}

function Hideout( options, argv, dir ){
  this.q = []
  this.options = options || {}
  this.argv = argv || {}
  this.pluginDir = dir || ""
}

Hideout.prototype = {}

Hideout.prototype.start = function ( dir, done ){
  this.pluginDir = dir
  this.done = done
  this.next()
}

Hideout.prototype.exit = function (){
  this.q = []
  this.done && this.done.apply(this, arguments)
}

Hideout.prototype.route = function ( router ){
  return this.queue(null, function ( done ){
    router(this.options, new Hideout(this.options, this.argv, this.pluginDir), done)
  })
}

Hideout.prototype.sequence = function ( name, filter ){
  if ( !filter || filter && filter(this.options) ) try {
    require("./sequences/" + name)(this)
  }
  catch ( e ) {
    hideout.error("Invalid sequence name '" + name + "'")
  }
  return this
}

Hideout.prototype.next = function (){
  if ( this.q.length )
    this.q.shift()(this)
  else
    this.exit(this.options)
}

Hideout.prototype.queue = function ( filter, task ){
  this.q.push(function ( H ){
    if ( !filter || filter && filter(H.options) ) task.call(H, function (){
      H.next()
    })
    else H.next()
  })
  return this
}

Hideout.prototype.config = function ( process, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    process(H.options)
    done()
  })
}

Hideout.prototype.log = function ( msg, filter ){
  msg = [].slice.call(arguments)
  if ( typeof arguments[arguments.length - 1] == "function" ) {
    filter = msg.pop()
  }
  return this.queue(filter, function ( done ){
    console.log.apply(console, msg)
    done()
  })
}

Hideout.prototype.warn = function ( msg, filter ){
  msg = [].slice.call(arguments)
  if ( typeof arguments[arguments.length - 1] == "function" ) {
    filter = msg.pop()
  }
  return this.queue(filter, function ( done ){
    console.warn.apply(console, msg)
    done()
  })
}

Hideout.prototype.error = function ( msg, filter ){
  msg = [].slice.call(arguments)
  if ( typeof arguments[arguments.length - 1] == "function" ) {
    filter = msg.pop()
  }
  return this.queue(filter, function ( done ){
    console.error.apply(console, msg)
    done()
  })
}

Hideout.prototype.ok = function ( msg, filter ){
  msg = [].slice.call(arguments)
  if ( typeof arguments[arguments.length - 1] == "function" ) {
    filter = msg.pop()
  }
  return this.queue(filter, function ( done ){
    console.log.apply(console, msg)
    done()
  })
}

Hideout.prototype.prompt = function ( questions, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    inquirer.prompt(questions, function ( answers ){
      hideout.extend(H.options, answers)
      done()
    })
  })
}

Hideout.prototype.ask = function ( questions, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    questions.type = "input"
    inquirer.prompt(questions, function ( answers ){
      hideout.extend(H.options, answers)
      done()
    })
  })
}

Hideout.prototype.confirm = function ( questions, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    questions.type = "confirm"
    inquirer.prompt(questions, function ( answers ){
      hideout.extend(H.options, answers)
      done()
    })
  })
}

Hideout.prototype.select = function ( questions, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    questions.type = "list"
    inquirer.prompt(questions, function ( answers ){
      hideout.extend(H.options, answers)
      done()
    })
  })
}

Hideout.prototype.selectMultiple = function ( questions, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    questions.type = "checkbox"
    inquirer.prompt(questions, function ( answers ){
      hideout.extend(H.options, answers)
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
  return this.queue(filter, function ( done ){
    var H = this
    var dest = options.dest || ""

    function doCopy( files ){
      async.each(files, function ( file, next ){
        // src path for current
        file = path.join(H.pluginDir, file)
        // dest path for current file
        var target
          , targetDir
        if ( !dest || /\/$/.test(dest) ) {
          target = path.join(cwd, dest, file)
        }
        else {
          target = path.join(cwd, dest)
          // flatten
          if ( options.flatten ) {
            target = path.join(cwd, dest, path.basename(file))
          }
        }
        // rename
        if ( options.rename ) {
          target = options.rename(target)
        }
        targetDir = path.dirname(target)
        mkdirp(path.dirname(targetDir), function (){
          // process
          if ( options.process ) {
            fs.readFile(file, "utf8", function ( err, data ){
              if ( err ) {
                hideout.error(err)
                next()
              }
              else fs.writeFile(target, options.process(data), "utf8", function ( err ){
                if ( err )
                  hideout.error(err)
                else
                  hideout.ok("Process:", file, "->", target)
                next()
              })
            })
          }
          // copy
          else try {
            fs.createReadStream(file)
              .pipe(fs.createWriteStream(target))
            hideout.ok("Copy:", file, "->", target)
          }
          catch ( e ) {
            hideout.error(e)
          }
          finally {
            next()
          }
        })
      }, done)
    }

    // copy glob patterned files
    if ( /\*|{|}|\||\[|\]/.test(options.src) ) {
      glob(options.src, {
        cwd: H.pluginDir
      }, function ( err, files ){
        if( err != undefined ) {
          hideout.error(err)
          done()
        }
        else doCopy(files)
      })
    }
    else if( typeof options.src == "string" ) {
      doCopy([options.src])
    }
    else if( options.src.length ) {
      doCopy(options.src)
    }

  })
}

Hideout.prototype.read = function ( src, process, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    fs.readFile(src, "utf8", function ( err, data ){
      process(err, data, H.options, done)
    })
  })
}

Hideout.prototype.readJSON = function ( src, process, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    fs.readFile(src, "utf8", function ( err, data ){
      try {
        process(err, JSON.parse(data), H.options, done)
      }
      catch ( e ) {
        process(e, null, H.options, done)
      }
    })
  })
}

Hideout.prototype.writeJSON = function ( dest, obj, filter ){
  return this.queue(filter, function ( done ){
    fs.writeFile(path.join(cwd, dest), JSON.stringify(obj, null, "  "), function ( err ){
      if ( err )
        hideout.error("JSON:", dest)
      else
        hideout.ok("JSON:", dest)
      done()
    })
  })
}

Hideout.prototype.write = function ( dest, content, filter ){
  return this.queue(filter, function ( done ){
    fs.writeFile(dest, content, "utf8", function ( err ){
      if ( err ) hideout.error(err)
      else hideout.ok("Write:", dest)
      done()
    })
  })
}

Hideout.prototype.make = function ( dirs, filter ){
  return this.queue(filter, function ( done ){
    async.each(dirs, function ( dir, next ){
      mkdirp(dir, function ( err ){
        if ( err )
          hideout.error(err)
        else
          hideout.ok("Make dir:", dir)
        next()
      })
    }, done)
  })
}

Hideout.prototype.glob = function ( pattern, process, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    glob(pattern, {
      cwd: H.pluginDir
    }, function ( err, files ){
      process(err, files, H.options, done)
    })
  })
}

Hideout.prototype.run = function ( cmd, result, filter ){
  var H = this
  return this.queue(filter, function ( done ){
//    console.log("Executing: ", "'"+cmd+"'")
    exec(cmd, function ( err, stdout, stderr ){
      result && result(err, stdout, stderr, H.options)
      done()
    })
  })
}

Hideout.prototype.runBatch = function ( commands, result, filter ){
  return this.queue(filter, function ( done ){
    async.each(commands, function ( cmd, next ){
//      console.log("Executing: ", "'"+cmd+"'")
      exec(cmd, function ( err, stdout, stderr ){
        result && result(err, stdout, stderr)
        next()
      })
    }, done)
  })
}

Hideout.prototype.package = function ( json, filter ){
  return this.queue(filter, function ( done ){
    fs.writeFile(path.join(cwd, "package.json"), JSON.stringify(json, null, "  "), function ( err ){
      if ( err )
        hideout.error(err)
      else
        hideout.ok("package.json")
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
  return this.queue(filter, function ( done ){
    var H = this
    var cmd = "npm install"
      + (packages.length ? " " + packages.join(" ") : "")
      + (options ? " " + options : "")
    exec(cmd, function ( err, stdout, stderr ){
      if ( err !== null ) {
        hideout.error("Error executing command: '" + cmd + "' " + err)
      }
      else {
        if ( H.argv.verbose ) {
          console.log(stdout)
          console.log(stderr)
        }
        hideout.ok("Installing npm modules:", packages.join(" "))
      }
      done()
    })
  })
}

Hideout.prototype.npmIgnore = function ( content, filter ){
  return this.queue(filter, function ( done ){
    fs.writeFile(path.join(cwd, ".npmignore"), content, "utf8", function ( err ){
      if ( err ) hideout.error(err)
      else hideout.ok(".npmignore")
      done()
    })
  })
}

Hideout.prototype.gitInit = function ( options, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    var cmd = "git init"
      + (options || "")
    exec(cmd, function ( err, stdout, stderr ){
      if ( err !== null ) {
        hideout.error("Error executing command: '" + cmd + "' " + err)
      }
      else {
        if ( H.argv.verbose ) {
          console.log(stdout)
          console.log(stderr)
        }
        hideout.ok("Initializing git repository..")
      }
      done()
    })
  })
}

Hideout.prototype.git = function ( options, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    var commands = []
    if ( options.init ) {
      commands.push("git init")
    }
    if ( options.setUrl ) {
      commands.push("git set-url " + options.setUrl)
    }
    if ( options.add ) {
      commands.push("git add " + options.add)
    }
    if ( options.commit ) {
      commands.push("git commit " + options.commit)
    }
    if ( options.push ) {
      commands.push("git push " + options.commit)
    }
    async.each(commands, function ( command, next ){
      exec(command, function ( err, stdout, stderr ){
        if ( err !== null ) {
          hideout.error("Error executing command: '" + command + "' " + err)
        }
        else {
          if ( H.argv.verbose ) {
            console.log(stdout)
            console.log(stderr)
          }
          hideout.ok(command)
        }
        next()
      })
    }, done)
  })
}

Hideout.prototype.gitIgnore = function ( content, filter ){
  return this.queue(filter, function ( done ){
    fs.writeFile(path.join(cwd, ".gitignore"), content, "utf8", function ( err ){
      if ( err ) hideout.error(err)
      else hideout.ok(".gitignore")
      done()
    })
  })
}

Hideout.prototype.readme = function ( content, filter ){
  return this.queue(filter, function ( done ){
    fs.writeFile(path.join(cwd, "README.md"), content, "utf8", function ( err ){
      if ( err ) hideout.error(err)
      else hideout.ok("README.md")
      done()
    })
  })
}
