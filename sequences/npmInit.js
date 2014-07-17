var path = require("path")

module.exports = function( hideout ){

  hideout
    .log("NPM init..")
    // collect basic information
    // note that this will fail if the cwd is not a git repo
    .run("git remote -v", function( err, stdout, stderr, options ){
      options.repository = (stdout.match(/https:.+?\.git/)||["No repository"])[0]
    })
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

    // prompt package.json fields
    .route(function( options, route, done ){
      route
        .config(function( options ){
          options.name = path.basename(process.cwd())
          options.version = "0.0.0"
          options.description = "No description"
          options.licence = "MIT"
        })
        .route(function( options, route, done ){
          route
            .ask({
              name: "name",
              message: "Name your module",
              'default': options.name
            }, function( options ){
              return !options.defaults
            })
            .ask({
              name: "version",
              message: "Version",
              'default': options.version
            }, function( options ){
              return !options.defaults
            })
            .ask({
              name: "description",
              message: "Description",
              'default': options.description
            }, function( options ){
              return !options.defaults
            })
            .ask({
              name: "repository",
              message: "Repository",
              'default': options.repository
            }, function( options ){
              return !options.defaults
            })
            .select({
              name: "licence",
              message: "Licence (you can learn more about this choice at http://choosealicense.com/licenses)",
              'default': options.licence,
              choices: options.licenceChoices
            }, function( options ){
              return !options.defaults
            })
            // put the actual writing of the package and the copying of the licence file
            // into a new route because the values for these need to be accessed after they are set
            .route(function( options, route, done ){
              route
                .log("Writing licence file..")
                .copy({
                  src: options.licences[options.licence],
                  dest: "LICENCE.md"
                })
                .log("Writing package.json..")
                .package({
                  "name": options.name,
                  "version": options.version,
                  "description": options.description,
                  "repository": {
                    "type": "git",
                    "url": options.repository
                  },
                  "author": options.username+" <"+options.email+">",
                  "license": options.licence,
                  "dependencies": {},
                  "devDependencies": {}
                })
                .start(__dirname, done)
            })
            .start(__dirname, done)
        })
        .start(__dirname, done)
    })
}