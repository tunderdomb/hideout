module.exports = function( hideout ){

  hideout
    .config(function( options ){
      options.bowerrcDir = "client/libs"
    })
    .sequence("npmInit")
    .sequence("bowerInit")
    .sequence("bowerrc")
    .make([
      ".config/",
      ".data/",
      ".des/",
      ".gen/",
      ".helpers/",
      ".helpers/",
      ".tasks/",
      "app/",
      "app/api/",
      "app/routes/",
      "app/util/",
      "client/",
      "logs/",
      "public/",
      "public/downloads/",
      "public/static/",
      "public/static/css/",
      "public/static/favicon/",
      "public/static/font/",
      "public/static/icon/",
      "public/static/img/",
      "public/static/js/",
      "public/static/template/",
      "public/uploads/",
      "style/",
      "style/font/",
      "style/import/",
      "style/reset/",
      "view/general/",
      "view/head/",
      "view/layout/",
      "view/main/"
    ])
    .copy([
      "**/*.*",
//      ".bowerrc",
      ".gitignore",
      "!hideout.js"
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
    .start(__dirname, function( options ){
      console.log("All done! Happy coding! (^_^)/")
    })

}