/** @module hideout */

var path = require("path")
var exec = require("child_process").exec
var fs = require("fs")
var async = require("async")
var mkdirp = require("mkdirp")
var glob = require("glob")
var inquirer = require("inquirer")
var chalk = require("chalk")

var cwd = process.cwd()

/** @namespace */
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

hideout.expand = function( src, cwd, done ){
  var expand = []
  if ( typeof src == "string" ) {
    if ( /\*|{|}|\||\[|\]/.test(src) ) {
      glob(src, {cwd: cwd}, function( err, files ){
        if( err ) {
          hideout.error(err)
          done()
        }
        done(files)
      })
    }
    else {
      expand.push(src)
      done(expand)
    }
  }
  else if ( Array.isArray(src) ) {
    async.eachSeries(src, function( pattern, next ){
      glob(pattern, {cwd: cwd}, function( err, files ){
        if( err ) {
          hideout.error(err)
          done()
        }
        expand = expand.concat(files)
        next()
      })
    }, function(  ){
      done(expand)
    })
  }
}

/**
 * A scaffolding context.
 * @constructor
 * @param {Object} [options] initial values
 * @param {Object} [argv] command line arguments
 * @param {String} [dir] plugin directory
 */
function Hideout( options, argv, dir ){
  this.q = []
  this.options = options || {}
  this.argv = argv || {}
  this.pluginDir = dir || ""
}

Hideout.prototype = {}

/**
 * Start the scaffolding process.
 * Start must be called to initiate execution.
 * Without calling it nothing will happen.
 *
 * @param {String} dir plugin directory used to resolve scaffolding files
 * @param {Function} [done] callback function called after everything is finished
 * @returns undefined
 * */
Hideout.prototype.start = function ( dir, done ){
  this.pluginDir = dir
  this.done = done
  this.next()
}

/**
 * Exit scaffolding, empty the execution queue and call the end callback if defined.
 * @returns undefined
 * */
Hideout.prototype.exit = function (){
  this.q = []
  this.done && this.done.apply(this, arguments)
}

/**
 * Start a new route in the process.
 * Use routes to define a separate branch of tasks to perform.
 * It is also good to group relevant tasks, and maybe execute them conditionally.
 * Routes are also useful if you need to use the values you previously prompted from the user.
 * @param {Function} router - the router function receiving the following arguments:
 *                            {Object}options, {Hideout}route, {Function}done
 * @returns {Hideout} this
 * */
Hideout.prototype.route = function ( router ){
  return this.queue(null, function ( done ){
    router(this.options, new Hideout(this.options, this.argv, this.pluginDir), done)
  })
}

/**
 * Initiate a built in sequence
 * @param {String} name - the name of the sequence
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
Hideout.prototype.sequence = function ( name, filter ){
  if ( !filter || filter && filter(this.options) ) try {
    require("./sequences/" + name)(this)
  }
  catch ( e ) {
    hideout.error("Invalid sequence name '" + name + "'")
  }
  return this
}

/**
 * Used internally to progress the process.
 * @private
 * @returns undefined
 * */
Hideout.prototype.next = function (){
  if ( this.q.length )
    this.q.shift()(this)
  else
    this.exit(this.options)
}

/**
 * Used internally to register tasks.
 * @private
 * @param {Function} [filter] - Conditionally execute the task based on this function return value.
 * @param {Function} task - The task function.
 * @returns {Hideout} this
 * */
Hideout.prototype.queue = function ( filter, task ){
  this.q.push(function ( H ){
    if ( !filter || filter && filter(H.options) ) task.call(H, function (){
      H.next()
    })
    else H.next()
  })
  return this
}

/**
 * Process the internal options object.
 * @param {Function} process - This callback is passed the internal options object.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
Hideout.prototype.config = function ( process, filter ){
  var H = this
  return this.queue(filter, function ( done ){
    process(H.options)
    done()
  })
}

/**
 * Log out a message.
 * Note: You can pass any number of arguments to this function,
 * but if the last one if a function it will be treated as a filter.
 * @param {String} msg - The message.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Log out a warning.
 * Note: You can pass any number of arguments to this function,
 * but if the last one if a function it will be treated as a filter.
 * @param {String} msg - The message.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Log out an error message.
 * Note: You can pass any number of arguments to this function,
 * but if the last one if a function it will be treated as a filter.
 * @param {String} msg - The message.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Log out a success message.
 * Note: You can pass any number of arguments to this function,
 * but if the last one if a function it will be treated as a filter.
 * @param {String} msg - The message.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Delegates to inquirer.
 * @param {Object} questions - a question object passed to inquirer.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
Hideout.prototype.prompt = function ( questions, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    inquirer.prompt(questions, function ( answers ){
      hideout.extend(H.options, answers)
      done()
    })
  })
}

/**
 * Simple input prompt
 * @param {Object} questions - a question object passed to inquirer.
 * @param {String} questions.name - The filed name of this value.
 *                                  The prompted value will be available on the options object as `options[name]`
 * @param {String} questions.message - The message to print out for the user.
 * @param {String} [questions.default] - A default value to select. *
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Yes or no question.
 * @param {Object} questions - a question object passed to inquirer.
 * @param {String} questions.name - The filed name of this value.
 *                                  The prompted value will be available on the options object as `options[name]`
 * @param {String} questions.message - The message to print out for the user.
 * @param {Boolean} [questions.default] - A default value to select.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Single choice select.
 * @param {Object} questions - a question object passed to inquirer.
 * @param {String} questions.name - The filed name of this value.
 *                                  The prompted value will be available on the options object as `options[name]`
 * @param {String} questions.message - The message to print out for the user.
 * @param {String[]} questions.choices - The choices to make. The selected string will be assigned to `options[name]`.
 * @param {String} [questions.default] - A default value to select.
 *
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Multiple choice checkboxes.
 * @param {Object} questions - a question object passed to inquirer.
 * @param {String} questions.name - The filed name of this value.
 *                                  The prompted value will be available on the options object as `options[name]`
 * @param {String} questions.message - The message to print out for the user.
 * @param {String[]} questions.choices - The choices to make. The selected string will be assigned to `options[name]`.
 * @param {String} [questions.default] - A default value to select.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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
 * Copy files from the plugin directory to the cwd.
 * @param options{Object}
 * @param {String|String[]} options.src - files to copy/process
 *                               can be a glob pattern like `"src/*.js"`
 *                               a single file path like `"src/that.js"`
 *                               or an array of file paths.
 * @param {String} [options.dest] - destination path. Default: ""
 * @param {String} [options.flatten] - remove directory parts from files
 * @param {String} [options.rename] - overwrite file path
 * @param {String} [options.process] - process file along the way
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
Hideout.prototype.copy = function ( options, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    var dest = options.dest || ""

    function doCopy( files ){
      async.eachSeries(files, function ( relativeFilePath, next ){
        // src path for current
        var srcPath = path.join(H.pluginDir, relativeFilePath)
        // dest path for current file
        var targetPath
        if ( !dest || /\/$/.test(dest) ) {
          targetPath = path.join(cwd, dest, relativeFilePath)
        }
        else {
          targetPath = path.join(cwd, dest)
          // flatten
          if ( options.flatten ) {
            targetPath = path.join(cwd, dest, path.basename(relativeFilePath))
          }
        }
        // rename
        if ( options.rename ) {
          targetPath = options.rename(targetPath)
        }
        mkdirp(path.dirname(targetPath), function (){
          // process
          if ( options.process ) {
            fs.readFile(srcPath, "utf8", function ( err, data ){
              if ( err ) {
                hideout.error(err)
                next()
              }
              else fs.writeFile(targetPath, options.process(data), "utf8", function ( err ){
                if ( err )
                  hideout.error(err)
                else
                  hideout.ok("Process:", relativeFilePath, "->", targetPath)
                next()
              })
            })
          }
          // copy
          else try {
            fs.createReadStream(srcPath)
              .pipe(fs.createWriteStream(targetPath))
            hideout.ok("Copy:", srcPath, "->", targetPath)
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

    hideout.expand(options.src, H.pluginDir, doCopy)
    // copy glob patterned files
//    if( typeof options.src == "string" ) {
//      if ( /\*|{|}|\||\[|\]/.test(options.src) ) {
//        glob(options.src, {
//          cwd: H.pluginDir
//        }, function ( err, files ){
//          if( err != undefined ) {
//            hideout.error(err)
//            done()
//          }
//          else doCopy(files)
//        })
//      }
//      else {
//        doCopy([options.src])
//      }
//    }
//    else if( options.src.length ) {
//      doCopy(options.src)
//    }

  })
}

/**
 * Read a file from the plugin dir.
 * @param {String} src - Source path relative to the plugin folder.
 * @param {Function} process - callback called with the following arguments: process(err, data, options, done).
 *                             The callback must call `done` to progress the execution.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
Hideout.prototype.read = function ( src, process, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    fs.readFile(path.join(H.pluginDir, src), "utf8", function ( err, data ){
      process(err, data, H.options, done)
    })
  })
}

/**
 * Read a file from the target dir (cwd)
 * @param {String} src - Source path relative to the cwd.
 * @param {Function} process - callback called with the following arguments: process(err, data, options, done).
 *                             The callback must call `done` to progress the execution.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
Hideout.prototype.readTarget = function ( src, process, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    fs.readFile(path.join(cwd, src), "utf8", function ( err, data ){
      process(err, data, H.options, done)
    })
  })
}

/**
 * Read a json file
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
Hideout.prototype.readJSON = function ( src, process, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    fs.readFile(path.join(H.pluginDir, src), "utf8", function ( err, data ){
      try {
        process(err, JSON.parse(data), H.options, done)
      }
      catch ( e ) {
        process(e, null, H.options, done)
      }
    })
  })
}

/**
 * Write a json file pretty printed with two spaces indentation.
 * @param {String} dest - destination path relative to the cwd. e.g.: `"bower.json"`
 * @param {Object} obj - The content of the file.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Write a file.
 * @param {String} dest - destination path relative to the cwd.
 * @param {String} content - The content of the file.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
Hideout.prototype.write = function ( dest, content, filter ){
  return this.queue(filter, function ( done ){
    fs.writeFile(dest, content, "utf8", function ( err ){
      if ( err ) hideout.error(err)
      else hideout.ok("Write:", dest)
      done()
    })
  })
}

/**
 * Create a list of directories.
 * @param {String[]} dirs - The directories to create.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Delegate the pattern to `glob`.
 * @param {String} pattern - Conditionally execute this task based on this function return value.
 * @param {Function} process - called with the following arguments: process(err, files, options, done)
 *                             This callback must call `done` when finished processing the files to
 *                             move forward the execution.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Runs a command in the cwd.
 * @param {String} cmd - the command to execute.
 * @param {Function} [result] - callback called for the command. Arguments: err, stdout, stderr
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Executes a list of commands.
 * @param {String[]} commands - the commands tp execute.
 * @param {Function} [result] - callback called for each command. Arguments: err, stdout, stderr
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Write a `package.json` to the root of the cwd.
 * @param {Object} json - The json content of the file.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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
 * Execute `npm install <packages> <options>` in the cwd.
 * @param {String[]} [packages] - A list of packages to pass to the command.
 * @param {String} [options] - Optional arguments passed after the command.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * */
Hideout.prototype.npmInstall = function ( packages, options, filter ){
  return this.queue(filter, function ( done ){
    var H = this
    var cmd = "npm install"
      + (packages && packages.length ? " " + packages.join(" ") : "")
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

/**
 * Write an `.npmignore` file to the root of the cwd.
 * @param {String} content - The content of the file.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
Hideout.prototype.npmIgnore = function ( content, filter ){
  return this.queue(filter, function ( done ){
    fs.writeFile(path.join(cwd, ".npmignore"), content, "utf8", function ( err ){
      if ( err ) hideout.error(err)
      else hideout.ok(".npmignore")
      done()
    })
  })
}

/**
 * Execute `git init` in the cwd.
 * @param {String} options - the options passed to the command: `git init <options>`
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Executes `git *` commands in the cwd
 * @param {Object} options - config object
 * @param {Boolean} [options.init] - executes `git init` in the cwd
 * @param {String} [options.setUrl] - executes `git set-url <options.setUrl>` in the cwd
 * @param {String} [options.add] - executes `git add <options.add>` in the cwd
 * @param {String} [options.commit] - executes `git commit <options.commit>` in the cwd
 * @param {String} [options.push] - executes `git push <options.push>` in the cwd
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
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

/**
 * Write a `.gitignore` file to the root of the cwd.
 * @param {String} content - the content of the `.gitignore` file.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
Hideout.prototype.gitIgnore = function ( content, filter ){
  return this.queue(filter, function ( done ){
    fs.writeFile(path.join(cwd, ".gitignore"), content, "utf8", function ( err ){
      if ( err ) hideout.error(err)
      else hideout.ok(".gitignore")
      done()
    })
  })
}

/**
 * Write a `README.md` file to the root of the cwd.
 * @param {String} content - the content of the readme.
 * @param {Function} [filter] - Conditionally execute this task based on this function return value.
 * @returns {Hideout} this
 * */
Hideout.prototype.readme = function ( content, filter ){
  return this.queue(filter, function ( done ){
    fs.writeFile(path.join(cwd, "README.md"), content, "utf8", function ( err ){
      if ( err ) hideout.error(err)
      else hideout.ok("README.md")
      done()
    })
  })
}
