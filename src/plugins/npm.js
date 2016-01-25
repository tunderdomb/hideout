var spawn = require("child_process").spawn

var pathUtils = require("../util/path")
var fs = require("./fs")
var plugin = require("../plugin")

module.exports = plugin({
  npmInstall: function(packages, options) {
    return function(resolve/*, reject*/) {
      packages = packages || []
      options = options || []

      var verbose = false
      var cmd = process.platform === "win32" ? "npm.cmd" : "npm"
      var args = ["install"].concat(packages).concat(options)
      var npm = spawn(cmd, args)

      if (verbose) {
        npm.stdout.pipe(process.stdout)
        npm.stderr.pipe(process.stderr)
      }

      npm.on("exit", function(code) {
        resolve(code)
      })
    }
  },
  npmIgnore: function(dir, content) {
    var filePath = pathUtils.appendOnce(dir, ".npmignore")
    return fs.write(filePath, content, "utf8")
  }
})
