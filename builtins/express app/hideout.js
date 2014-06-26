module.exports = function( hideout ){

  hideout
    .sequence("npmInit")
    .sequence("bowerInit")
    .make([
      ".gen/sprite/",
      "app/api/",
      "app/routes/",
      "app/services/",
      "client/",
      "public/downloads",
      "public/static/css",
      "public/static/favicon",
      "public/static/font",
      "public/static/icon",
      "public/static/img",
      "public/static/font",
      "public/static/js",
      "public/uploads",
      "style/",
    ])
    .copy([
      "!hideout.js",
      "./**/*.js"
    ])
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
    .npmInstall()
    .log("Installing bower modules...")
    .run("bower install hud --save")
    .start(__dirname, function( options ){
      console.log("All done! Happy coding! (^_^)/")
    })

}