var transform = require("../transform")

module.exports = transform({
  assign: function(obj, property, transform) {
    return function(input) {
      if (typeof transform == "function") {
        input = transform(input)
      }
      obj[property] = input
      return obj
    }
  }
})
