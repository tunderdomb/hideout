var fs = require("fs")
var path = require("path")

var TEMPLATE_INDEX = path.join(process.cwd(), ".config/compile.json")

function getTemplates(){
  return JSON.parse(fs.readFileSync(TEMPLATE_INDEX, "utf8"))
}

function config( grunt ){
  var templates = getTemplates()
    , targets = []

  for( var target in templates ){
    grunt.config("dustin."+target, templates[target])
    targets.push(target)
  }

  return targets
}

module.exports = function ( grunt ){

  grunt.config("watch.dustCompile", {
    files: [TEMPLATE_INDEX, "view/**/*.dust"],
    tasks: ["compileTemplates"]
  })

  grunt.registerTask("compileTemplates", function (){
    try {
      config(grunt).forEach(function( target ){
        grunt.task.run("dustin:"+target)
      })
    }
    catch ( e ) {
      console.error(e)
    }
  })

  config( grunt )

}