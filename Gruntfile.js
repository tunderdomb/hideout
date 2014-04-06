module.exports = function ( grunt ){

  grunt.initConfig({
    jsdoc : {
      dist : {
        src: [
          "hideout.js"
        ],
        options: {
          destination: 'docs',
          template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
          configure: 'jsdoc.conf.json'
        }
      }
    }
  })

  require('load-grunt-tasks')(grunt)
//  grunt.loadTasks("tasks")

  grunt.registerTask("default", "", ["jsdoc"])
}