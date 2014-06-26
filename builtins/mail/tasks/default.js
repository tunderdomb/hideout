var boomer = require("boomer")

module.exports = function ( grunt ){

  grunt.loadNpmTasks("grunt-dustin")
  grunt.loadNpmTasks("grunt-premailer")

  grunt.config("dustin.render", {
    options: {
      render: true,
      resolve: "template/",
      // we don't care about white space in compiled templates
      preserveWhiteSpace: true
    },
    expand: true,
    cwd: "template/mails",
    src: "*.dust",
    dest: "rendered/",
    ext: ".html"
  })

  grunt.config("premailer.inline", {
    options: {
      baseUrl: "",
      removeClasses: false,
      removeComments: true,
      preserveStyles: true
    },
    expand: true,
    cwd: "rendered/",
    src: "*.html",
    dest: "rendered/"
  })

  boomer(grunt, "default")
    .connect({
      hostname: "*",
      base: "rendered/"
    })
    .lr({
      html: "rendered/*.html"
    })
    .watch({
      options: {
        spawn: false,
        interrupt: true
      },
      html: {
        files: ["template/**/*.dust"],
        tasks: ["dustin:render", "premailer", "lr:html"]
      }
    })
    .started(function( options ){
      grunt.config("premailer.inline.options.baseUrl", "http://"+options.host+":"+options.port)
    })

}