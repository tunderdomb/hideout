module.exports = function( hideout ){

  hideout
    .sequence("npmInit")
    .sequence("bowerInit")
    .make([
      "des",
      "gen",
      "tasks",
      "res/components",
      "res/data",
      "res/layout",
      "res/pages",
      "res/helpers",
      "res/script",
      "res/style/import",
      "src/media/image",
      "src/media/audio",
      "src/media/video",
      "src/script",
      "src/static/css",
      "src/static/font",
      "src/static/icon",
      "src/static/pattern",
      "src/static/sprite",
      "src/template"
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
        .start(__dirname, done)
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