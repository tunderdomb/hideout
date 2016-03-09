var plugin = require("../plugin")
var logger = require("../util/logger")

module.exports = plugin({
  log: function() {
    var args = arguments
    return function(/*resolve, reject*/) {
      console.apply("log", args)
    }
  },
  tag: function() {
    var args = arguments
    return function(/*resolve, reject*/) {
      console.apply("tag", args)
    }
  },
  ok: function() {
    var args = arguments
    return function(/*resolve, reject*/) {
      console.apply("ok", args)
    }
  },
  error: function() {
    var args = arguments
    return function(/*resolve, reject*/) {
      console.apply("error", args)
    }
  },
  warn: function() {
    var args = arguments
    return function(/*resolve, reject*/) {
      console.apply("warn", args)
    }
  },
  info: function() {
    var args = arguments
    return function(/*resolve, reject*/) {
      console.apply("info", args)
    }
  },
  label: function() {
    var args = arguments
    return function(/*resolve, reject*/) {
      console.apply("label", args)
    }
  },
  stack: function() {
    var args = arguments
    return function(/*resolve, reject*/) {
      console.apply("stack", args)
    }
  }
})
