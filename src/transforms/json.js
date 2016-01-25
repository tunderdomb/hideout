var transform = require("../transform")

module.exports = transform({
  parse: function() {
    return function(input) {
      return JSON.parse(input)
    }
  },
  stringify: function() {
    return function(input) {
      JSON.stringify(input)
    }
  }
})
