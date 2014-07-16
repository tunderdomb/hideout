var boomer = require("boomer")
var express = require("express")
var app = express()

module.exports = function( grunt ){

  boomer(grunt)
    .express(app, function(  ){
      require("../app/index")(app)
      app.get("log").info("App started")
//      require("./weinre")(app)
    })
    .lr({
      dust: {
        options: {refresh: true},
        src: "view/**/*.dust"
      },
      css: "public/static/css/*.css",
      js: {
        options: {refresh: true},
        src: "public/static/js/**/*.js"
      },
      img: "public/static/img/**/*.{jpe?g,png,gif,svg}"
    })
    .watch({
      options: {
        spawn: false,
        interrupt: true
      },
      configs: {
        files: [ "Gruntfile.js", ".tasks/*.js" ],
        options: {
          reload: true
        }
      },
      dust: {
        files: [
          "view/data/*.json",
          "view/**/*.dust"
        ],
        tasks: ["newer:stylist", "lr:dust"]
      },
      img: {
        files: "public/static/img/**/*.{jpe?g,png,gif,svg}",
        tasks: ["newer:lr:img"]
      },
      css: {
        files: [
          "style/**/*.less"
        ],
        tasks: ["less", "newer:autoprefixer", "newer:lr:css"]
      },
      js: {
        files: [
          "public/static/js/**/*.js"
        ],
        tasks: ["newer:lr:js"]
      }
    })


}