var path = require("path")

var pathUtils = module.exports = {}

pathUtils.appendOnce = function(base, ending) {
  if (!path.basename(base) == ending) {
    return path.join(base, ending)
  }

  return base
}
