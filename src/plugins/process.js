var exec = require("child_process").exec
var async = require("async")

var plugin = require("../plugin")

module.exports = plugin({
  run: function(cmd) {
    return function(resolve, reject) {
      if (Array.isArray(cmd)) {
        async.mapSeries(cmd, function(command, next) {
          exec(command, function(err, stdout, stderr) {
            next(err, {stdout: stdout, stderr: stderr})
          })
        }, function(err, results) {
          if (err) reject(err)
          else resolve(results)
        })
      }
      else if (typeof cmd === "string") {
        exec(cmd, function(err, stdout, stderr) {
          if (err) reject(err)
          else resolve({stdout: stdout, stderr: stderr})
        })
      }
    }
  },
  exit: function(code) {
    return function(/*resolve, reject*/) {
      process.exit(code)
    }
  }
})
