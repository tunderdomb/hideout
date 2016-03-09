var hideout = module.exports = {}

hideout.tasks = new (require("orchestrator"))
hideout.color = require("chalk")
hideout.arguments = require("minimist")(process.argv.slice(2))

hideout.plugin = require("./src/plugin")
hideout.transform = require("./src/transform")
hideout.use = use

hideout.cli = require("./src/plugins/cli")
hideout.fs = require("./src/plugins/fs")
hideout.flow = require("./src/plugins/flow")
hideout.git = require("./src/plugins/git")
hideout.log = require("./src/plugins/log")
hideout.npm = require("./src/plugins/npm")
hideout.packageJson = require("./src/plugins/packageJson")
hideout.process = require("./src/plugins/process")

hideout.transforms = {}
hideout.transforms.cli = require("./src/transforms/cli")
hideout.transforms.json = require("./src/transforms/json")
hideout.transforms.path = require("./src/transforms/path")

hideout.util = {}
hideout.util.path = require("./src/util/path")
hideout.util.src = require("./src/util/src")
hideout.util.resolutionCallback = require("./src/util/resolutionCallback")
hideout.util.logger = require("./src/util/logger")

function use(src) {
  try {
    switch (typeof src) {
      case "string":
        require(src)(hideout)
        break
      case "function":
        src(hideout)
        break
    }
  }
  catch (e) {
    console.log("Missing/invalid module %s", src)
    throw e
  }
}
