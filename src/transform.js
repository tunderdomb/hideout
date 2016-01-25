module.exports = function(methods) {
  var plugin = {}

  for (var name in methods) {
    if (methods.hasOwnProperty(name)) {
      plugin[name] = createTool(methods[name])
    }
  }

  return plugin
}

function createTool(method) {
  return function tool() {
    var handler = method.apply(this, arguments)

    return function(result) {
      return handler(result)
    }
  }
}
