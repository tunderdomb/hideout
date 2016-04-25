var fs = require("fs")
var path = require("path")

var async = require("async")
var mkdirp = require("mkdirp")
var ncp = require("ncp").ncp
var rimraf = require("rimraf")

var plugin = require("../plugin")
var resolutionCallback = require("../util/resolutionCallback")
var getSrc = require("../util/src")

module.exports = plugin({
  src: function(paths, options, exclude) {
    return function(resolve, reject) {
      getSrc(paths, options, exclude, resolutionCallback(resolve, reject))
    }
  },
  copy: function(paths, dest) {
    return function(resolve, reject) {
      if (Array.isArray(paths)) {
        async.each(paths, function(p, next) {
          mkdirp(path.dirname(dest), function(err) {
            if (err) {
              next(err)
            }
            else {
              ncp(p, dest, next)
            }
          })
        }, resolutionCallback(resolve, reject))
      }
      else {
        mkdirp(path.dirname(dest), function(err) {
          if (err) {
            reject(err)
          }
          else {
            ncp(paths, dest, resolutionCallback(resolve, reject))
          }
        })
      }
    }
  },
  read: function(paths, encoding) {
    encoding = encoding || "utf8"
    return function(resolve, reject) {
      if (Array.isArray(paths)) {
        async.map(paths, function(p, next) {
          fs.readFile(p, encoding, next)
        }, resolutionCallback(resolve, reject))
      }
      else {
        fs.readFile(paths, encoding, resolutionCallback(resolve, reject))
      }
    }
  },
  write: function(paths, content, encoding) {
    encoding = encoding || "utf8"
    return function(resolve, reject) {
      if (Array.isArray(paths)) {
        async.each(paths, function(p, next) {
          mkdirp(path.dirname(p), function(err) {
            if (err) {
              next(err)
            }
            else {
              fs.writeFile(paths, content, encoding, next)
            }
          })
        }, resolutionCallback(resolve, reject))
      }
      else {
        mkdirp(path.dirname(paths), function(err) {
          if (err) {
            reject(err)
          }
          else {
            fs.writeFile(paths, content, encoding, resolutionCallback(resolve, reject))
          }
        })
      }
    }
  },
  makeDir: function(dirs) {
    return function(resolve, reject) {
      if (Array.isArray(dirs)) {
        async.each(dirs, mkdirp, resolutionCallback(resolve, reject))
      }
      else {
        mkdirp(dirs, resolutionCallback(resolve, reject))
      }
    }
  },
  remove: function(paths) {
    return function(resolve, reject) {
      if (Array.isArray(paths)) {
        async.each(paths, rimraf, resolutionCallback(resolve, reject))
      }
      else {
        rimraf(paths, resolutionCallback(resolve, reject))
      }
    }
  }
})
