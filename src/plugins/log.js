var plugin = require("../plugin")

module.exports = plugin({
  log: function(msg) {
    return function(/*resolve, reject*/) {
      console.log(msg)
    }
  },
  warn: function(msg) {
    return function(/*resolve, reject*/) {
      console.warn(msg)
    }
  },
  error: function(msg) {
    return function(/*resolve, reject*/) {
      console.error(msg)
    }
  }
})
