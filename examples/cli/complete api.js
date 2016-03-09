var hideout = require("hideout")
var cli = hideout.cli
var assign = hideout.transforms.cli.assign

module.exports = function init() {
  cli
    // initiate a session with a context
    .session("Hello welcome!", {})
    // simple prompt
    .then(function(vars) {
      return cli
        .ask("tell me something:")
        .then(assign(vars, "ask"))
    })
    // a sub section
    .then(function(vars) {
      return cli
        .session("some sub vars", {})
        .then(function(sub) {
          return cli
            .ask("a thing:")
            .then(assign(sub, "a"))
        })
        .then(assign(vars, "sub"))
    })
    // confirm
    .then(function(vars) {
      return cli
        .confirm("sure?")
        .then(assign(vars, "confirm"))
    })
    // choices
    .then(function(vars) {
      return cli
        .select("select one:", ["this", "or this", "maybe this"])
        .then(assign(vars, "select"))
    })
    // checkbox
    .then(function(vars) {
      return cli
        .checkbox("check what you need:", ["this", "or this", "maybe this"])
        .then(assign(vars, "checkbox"))
    })
    // password
    .then(function(vars) {
      return cli
        .password("password:")
        .then(assign(vars, "password"))
    })
    // log
    .then(function(vars) {
      console.log("vars", vars)
    })
}
