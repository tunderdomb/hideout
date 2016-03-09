module.exports = function resolutionCallback(resolve, reject) {
  return function(err, result) {
    if (err) {
      reject(err)
    }
    else {
      resolve(result)
    }
  }
}
