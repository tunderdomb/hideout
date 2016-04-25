var resolutionCallback = require("./resolutionCallback")

module.exports = function (fn, args) {
  args = [].slice.call(arguments, 1)
  return new Promise(function (resolve, reject) {
    args.push(resolutionCallback(resolve, reject))
    fn.apply(null, args)
  })
}