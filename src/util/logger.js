var colors = require("chalk")

var logger = module.exports = {}
var format = logger.format = {}

var log = create("log")
var error = create("error")
var warn = create("warn")
var info = create("info")

function nargs(args, nth) {
  return [].slice.call(args, nth)
}

function tagged(tag, color, args) {
  var first = args.shift() || ""
  return [colors[color](tag) + " " + first].concat(args)
}

function labelled(tagColor, labelColor, args) {
  return [colors[tagColor](args.shift())].concat(args.map(function(arg) {
    return colors[labelColor](arg)
  }))
}

function message(level, args) {
  return console[level].apply(console, [].slice.call(args))
}

function create(level) {
  return function(args) {
    message(level, args)
  }
}

format.comment = function() {
  return colors.gray([].join.call(nargs(arguments), " "))
}

format.label = function() {
  var args = nargs(arguments)
  return [colors.magenta(args.shift())].concat(args.map(function(arg) {
    return colors.cyan(arg)
  })).join(" ")
}

format.value = function() {
  var args = nargs(arguments)
  return args.map(function(arg) {
    return colors.cyan(arg)
  }).join(" ")
}

format.title = function() {
  var args = nargs(arguments)
  return args.map(function(arg) {
    return colors.bgWhite(colors.black(" " + arg + " "))
  }).join(" ")
}

logger.apply = function(method, args, nth) {
  logger[method].apply(null, [].slice.call(args, nth))
}

// OK! message
logger.ok = function() {
  log(tagged("OK!", "green", nargs(arguments)))
}

// Err message
logger.error = function() {
  error(tagged("Err", "red", nargs(arguments)))
}

// /!\ message
logger.warn = function() {
  warn(tagged("/!\\", "yellow", nargs(arguments)))
}

// (i) message
logger.info = function() {
  info(tagged("(i)", "blue", nargs(arguments)))
}

// [tag] message
logger.tag = function(tag, color) {
  log(tagged("[" + tag + "]", color, nargs(arguments, 2)))
}

// Label: value
logger.label = function() {
  info(labelled("magenta", "cyan", nargs(arguments)))
}

// Message stack
logger.stack = function(err) {
  if (Array.isArray(err)) {
    err.forEach(function(e) {
      logger.stack(e)
    })
    return
  }
  info(labelled("red", "gray", [err, err.stack ? err.stack.replace(err, "") : ""]))
}

// message
logger.log = function() {
  message("log", nargs(arguments))
}

/*
logger.ok("Everything is %s", "good")
logger.error("Everything is %s", "bad")
logger.warn("Everything is %s", "failing")
logger.info("Everything is %s", "interesting")
logger.label("Everything is", "labelled")
logger.tag("tag", "black", "Everything is %s", "tagged")
logger.log("Everything is %s", "logged")
logger.stack(new Error("hello"))
logger.log(logger.format.label("format", "label"))
logger.log(logger.format.comment("format", "comment"))
*/
