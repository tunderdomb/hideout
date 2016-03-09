var plugin = require("../plugin")
var resultToPromise = require("../util/resultToPromise")

module.exports = plugin({
  series: function(array, callback) {
    return array.reduce(function(promise, item, index) {
      return promise.then(function() {
        return callback(item, index, array)
      })
    }, Promise.resolve())
  },
  parallel: function(array, callback) {
    return Promise.all(array.map(function(item, index) {
      return resultToPromise(callback(item, index, array))
    }))
  },
  map: function(array, callback) {
    var results = new Array(array.length)
    return this.parallel(array, function(item, index) {
      return resultToPromise(callback(item, index, array)).then(function(result) {
        results[index] = result
      })
    }).then(function() {
      return results
    })
  }
})
