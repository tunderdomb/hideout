var fs = require("./fs")
var json = require("../transforms/json")
var pathUtils = require("../util/path")
var plugin = require("../plugin")

module.exports = plugin({
  read: function(src) {
    var filePath = pathUtils.appendOnce(src, "package.json")
    return fs.read(filePath).then(json.parse())
  },
  write: function(src, content) {
    var filePath = pathUtils.appendOnce(src, "package.json")
    return Promise.resolve(content).then(json.stringify()).then(function(file) {
      return fs.write(filePath, file)
    })
  }
})
