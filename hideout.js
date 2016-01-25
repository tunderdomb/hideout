var hideout = module.exports = {}

hideout.cli = require("./src/plugins/cli")
hideout.fs = require("./src/plugins/fs")
hideout.git = require("./src/plugins/git")
hideout.log = require("./src/plugins/log")
hideout.npm = require("./src/plugins/npm")
hideout.packageJson = require("./src/plugins/packageJson")
hideout.process = require("./src/plugins/process")

hideout.transforms = {}
hideout.transforms.json = require("./src/transforms/json")
hideout.transforms.path = require("./src/transforms/path")
