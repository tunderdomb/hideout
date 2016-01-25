module.exports = function(methods) {
  var plugin = {}

  for (var name in methods) {
    if (methods.hasOwnProperty(name)) {
      plugin[name] = createTask(methods[name])
    }
  }

  return plugin
}

function createTask(method) {
  return function task() {
    var resolution = method.apply(this, arguments)
    if (resolution instanceof Promise) {
      return resolution
    }
    return new Promise(resolution)
  }
}
