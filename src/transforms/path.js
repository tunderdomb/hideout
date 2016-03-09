var path = require("path")
var transform = require("../transform")

module.exports = transform({
  flatten: function(cwd, dest) {
    return function(input) {
      if (dest) {
        return path.join(cwd, dest, path.basename(input))
      }
      return path.join(cwd, path.basename(input))
    }
  },
  rename: function(newName) {
    return function(input) {
      if (typeof newName == "function") {
        return newName(input)
      }
      if (typeof newName == "string") {
        return path.join(path.dirname(input), newName + path.extname(input))
      }
      return input
    }
  },
  ext: function(newExt) {
    return function(input) {
      if (typeof newExt == "function") {
        return newExt(input)
      }
      if (typeof newExt == "string") {
        if (newExt) {
          newExt = newExt[0] == "."
              ? newExt
              : "." + newExt
        }
        return path.join(path.dirname(input), path.basename(input, path.extname(input)) + newExt)
      }
      return input
    }
  }
})
