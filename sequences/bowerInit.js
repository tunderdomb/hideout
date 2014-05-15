var path = require("path")

module.exports = function( hideout ){

  hideout
    .log("Bower init..")
    // collect basic information
    .run("npm config get username", function( err, stdout, stderr, options ){
      options.username = stdout.trim()
    })
    .run("npm config get email", function( err, stdout, stderr, options ){
      options.email = stdout.trim()
    })
    .route(function( options, route, done ){
      route
        // collect licence files
        // scope this to the sequence dir
        // otherwise the glob would execute in the plugin context
        .glob("../licences/*.md", function( err, licences, options, done ){
          options.licences = {}
          options.licenceChoices = licences.map(function( src ){
            var name = path.basename(src, path.extname(src))
            options.licences[name] = src
            return name
          })
          done()
        })
        .start(__dirname, done)
    })

    // prompt bower.json fields
    .route(function( options, route, done ){
      route
        .config(function( options ){
          options["name"] = path.basename(process.cwd())
          options["version"] = "0.0.0"
          options["description"] = ""
          options["licence"] = "MIT"
        })
        .ask({
          name: "name",
          message: "Name your module",
          'default': path.basename(process.cwd())
        }, function( options ){
          return !options.defaults
        })
        .ask({
          name: "version",
          message: "Version",
          'default': "0.0.0"
        }, function( options ){
          return !options.defaults
        })
        .ask({
          name: "description",
          message: "Description",
          'default': ""
        }, function( options ){
          return !options.defaults
        })
        .select({
          name: "licence",
          message: "Licence (you can learn more about this choice at http://choosealicense.com/licenses)",
          'default': "MIT",
          choices: options.licenceChoices
        }, function( options ){
          return !options.defaults
        })
        .ask({
          name: "directory",
          message: ".bowerrc directory",
          'default': "src/script"
        }, function( options ){
          return !options.defaults
        })
        // put the actual writing of the package and the copying of the licence file
        // into a new route because the values for these need to be accessed after they are set
        .route(function( options, route, done ){
          route
            .log("Writing bower.json..")
            .writeJSON("bower.json", {
              "name": options.name,
              "version": options.version,
              "description": options.description,
              "authors": [
                options.username+" <"+options.email+">"
              ],
              "moduleType": [
                "globals"
              ],
              "license": options.licence,
              "private": true,
              "ignore": [
                "**/.*",
                "node_modules",
                "bower_components",
                "test",
                "tests"
              ],
              "dependencies": {},
              "devDependencies": {}
            })
            .writeJSON(".bowerrc", {
              directory: options.directory
            })
            .start(__dirname, done)
        })
        .start(__dirname, done)
    })
}