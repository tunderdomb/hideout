module.exports = function( hideout ){

  hideout
    .sequence("npmInit")
    .sequence("bowerInit")
    .make([
      "app",
      "app/api",
      "app/routes",
      "modules",
      "public",
      "public/download",
      "public/static",
      "public/static/css",
      "public/static/font",
      "public/static/icon",
      "public/static/pattern",
      "public/static/sprite",
    ])
    .copy({
      src: [
        "Gruntfile.js",
        "tasks/*.js",
        "res/**/*.*",
        ".gitignore",
        ".npmignore"
      ]
    })
    .route(function( options, route, done ){
      route
        .copy({
          src: "README.md",
          process: function( content ){
            return content + options.name + "\n" +
              "====\n"
          }
        })
        .start(done)
    })
    .log("Installing npm modules...")
    .npmInstall([
      "grunt",
      "grunt-stylist",
      "grunt-contrib-concat",
      "grunt-contrib-less",
      "grunt-contrib-clean",
      "load-grunt-tasks",
      "grunt-autoprefixer",
      "grunt-newer",
      "grunt-dustin",
      "boomer"
    ], "--save-dev")
    .log("Installing bower modules...")
    .run("bower install hud --save")
    .start(__dirname, function( options ){
      console.log("All done! Happy coding! (^_^)/")
    })

}