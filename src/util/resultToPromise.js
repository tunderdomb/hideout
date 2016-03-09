module.exports = function(result) {
  if (result instanceof Promise) {
    return result
  }

  return Promise.resolve(result)
}
