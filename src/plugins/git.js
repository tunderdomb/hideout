var exec = require("child_process").exec

var plugin = require("../plugin")
var fs = require("./fs")
var pathUtils = require("../util/path")

module.exports = plugin({
  init: function(options) {
    options = options || ""

    return function(resolve, reject) {
      var cmd = "git init" + options

      exec(cmd, function(err/*, stdout, stderr*/) {
        if (err) reject(err)
        else resolve()
      })
    }
  },
  gitIgnore: function(dir, content) {
    var filePath = pathUtils.appendOnce(dir, ".gitignore")
    return fs.write(filePath, content, "utf8")
  }
})
