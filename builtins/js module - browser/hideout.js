var path = require("path")

module.exports = function ( hideout ){
  hideout
    .config(function( options ){
      options["test-suit"] = "mocha"
      options["assertion-library"] = "chai"
      options["dev-style"] = "expect"
    })
    .ask({
      name: "defaults",
      message: "Use defaults (no questions asked)",
      'default': true
    })
    // mimic npm init command
    .sequence("npmInit")
    // testing framework and stuff
    .select({
      name: "test-suit",
      message: "Select a test framework",
      'default': "mocha",
      choices: ["mocha"]
    }, function( options ){
      return !options.defaults
    })
    .select({
      name: "assertion-library",
      message: "Select an assertion library",
      'default': "chai",
      choices: ["should.js", "expect.js", "chai", "better-assert"]
    }, function( options ){
      return !options.defaults
    })
    .select({
      name: "dev-style",
      message: "Select your development style",
      'default': "expect",
      choices: ["assert", "expect", "should"]
    }, function ( options ){
      if( options.defaults ) return false
      return options["assertion-library"] == "chai"
    })
    .route(function ( options, hideout, done ){
      hideout
        .readme([
          options.name,
          "===",
          ""
        ].join("\n"))
        .gitIgnore([
          "lib-cov",
          "*.seed",
          "*.log",
          "*.csv",
          "*.dat",
          "*.out",
          "*.pid",
          "*.gz",
          "",
          "pids",
          "logs",
          "results",
          "",
          "npm-debug.log",
          "node_modules",
          ""
        ].join("\n"))
        .start(__dirname, done)
    })
    .ok("Aaand done. Code away!")
    .start(__dirname)
}