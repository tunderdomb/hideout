module.exports = function ( grunt ){

  grunt.initConfig({
    clean: {
      build: {
        src: "build/**/*"
      },
      gen: {
        src: "gen/**/*"
      }
    },
    newer: {
      options: {
        cache: "gen/newer"
      }
    }
  })

  require('load-grunt-tasks')(grunt)
  grunt.loadTasks("tasks")

};