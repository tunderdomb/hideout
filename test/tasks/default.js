var boomer = require("boomer")

module.exports = function ( grunt ){

  boomer(grunt, "default")
    .connect({
      hostname: "*",
      base: "src/"
    })
    .lr({
      html: "src/*.html",
      css: "src/static/css/*.css",
      js: "src/script/**/*.js"
    })
    .watch({
      options: {
        spawn: false,
        interrupt: true
      },
      html: {
        files: [
          "res/data/*.json",
          "res/**/*.dust"
        ],
        tasks: ["embrace", "newer:stylist", "lr:html"]
      },
      css: {
        files: [
          "res/style/**/*.less"
        ],
        tasks: ["less", "newer:autoprefixer", "newer:lr:css"]
      },
      js: {
        files: [
          "res/api/**/*.js"
        ],
        tasks: ["concat", "newer:lr:js"]
      }
    })

}