module.exports = function( hideout ){

  hideout
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
      ".config/*.*",
      ".data/*.*",
      ".tasks/*.*",
      ".gitignore",
      "!hideout.js"
    ])
    .sequence("npmInit")
    .sequence("bowerInit")
    .config(function( options ){
      options.bowerrcDir = "client/libs"
    })
    .sequence("bowerrc")
    .dependencies({
      "superagent": "0.18.0",
      "formidable": "1.0.15",
      "cookie-parser": "1.3.1",
      "cookie": "0.1.2",
      "grunt-dustin": "0.2.3",
      "express": "4.3.0",
      "serve-index": "1.0.3",
      "bunyan": "0.23.1",
      "async": "0.9.0",
      "serve-favicon": "2.0.1"
    })
    .devDependencies({
      "grunt-contrib-concat": "0.4.0",
      "grunt": "0.4.5",    "grunt-autoprefixer": "0.7.3",
      "grunt-contrib-clean": "0.5.0",
      "grunt-contrib-less": "0.11.0",
      "grunt-newer": "0.7.0",
      "grunt-stylist": "0.1.7",
      "load-grunt-tasks": "0.4.0",
      "grunt-spritesmith": "2.1.0",
      "boomer": "1.5.4"
    })
    .package({
      scripts: {
        start: "node app.js"
      }
    })
    .log("Installing npm modules...")
    .npmInstall()
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
    .start(__dirname, function( options ){
      console.log("All done! Happy coding! (^_^)/")
    })

}