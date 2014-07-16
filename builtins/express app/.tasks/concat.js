var fs = require("fs")
var path = require("path")

var MODULES_INDEX = path.join(process.cwd(), ".config/concat.json")

function getModules(){
  return JSON.parse(fs.readFileSync(MODULES_INDEX, "utf8"))
}

function config( grunt ){
  grunt.config("concat", getModules())
}

module.exports = function ( grunt ){

  grunt.config("watch.modules", {
    files: [
      "client/**/*.js",
      MODULES_INDEX
    ],
    tasks: ["modules", "lr:js"]
  })

  grunt.registerTask("modules", function (){
    try {
      config(grunt)
      grunt.task.run("concat")
    }
    catch ( e ) {
      console.error(e)
    }
  })

  config(grunt)
}