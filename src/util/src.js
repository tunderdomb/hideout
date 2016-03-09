var glob = require("glob")
var minimatch = require("minimatch")
var async = require("async")

function excludePatterns(sources, exclude) {
  if (Array.isArray(exclude)) {
    exclude.forEach(function(pattern) {
      sources = sources.filter(function(src) {
        return !minimatch(src, pattern)
      })
    })
  }

  return sources
}

function filterDuplicates(sources) {
  return sources.filter(function(src) {
    return !~sources.indexOf(src)
  })
}

module.exports = function(paths, options, exclude, cb) {
  if (options == "string") {
    options = {cwd: options}
  }

  var sources = []

  if (Array.isArray(paths)) {
    async.eachSeries(paths, function(pattern, next) {
      if (!glob.hasMagic(pattern)) {
        sources.push(pattern)
      }
      else {
        glob(pattern, options, next)
      }
    }, function() {
      sources = filterDuplicates(sources)
      sources = excludePatterns(sources, exclude)
      cb(null, sources)
    })
  }
  else if (!glob.hasMagic(paths)) {
    cb(null, [paths])
  }
  else {
    glob(paths, options, cb)
  }
}
