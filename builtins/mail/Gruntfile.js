var boomer = require("boomer")
var path = require("path")
var fs = require("fs")

module.exports = function ( grunt ){

  function setCredentials(  ){
    var auth =  JSON.parse(fs.readFileSync("./cretentials.json"))
    grunt.config("nodemailer.send.options.transport.auth", auth)
  }

  grunt.initConfig({})

  grunt.config("premailer.inline", {
    options: {
      baseUrl: "",
      removeClasses: true,
      removeComments: true,
      preserveStyles: false
    },
    expand: true,
    cwd: "rendered/",
    src: "*.html",
    dest: "rendered/"
  })

  grunt.config("nodemailer.send", {
    options: {
      transport: {
        type: 'SMTP',
        options: {
          service: 'Gmail',
          auth: {
            user: "",
            pass: ""
          }
        }
      },
      message: {
        forceEmbeddedImages: true
      },
      recipients: []
    },
    src: ["rendered/*.html"]
  })

  grunt.registerTask("send", function ( email ){
    if ( email ) {
      var src = path.concat(__dirname, "rendered", email + ".html")
      if ( grunt.file.exists(src) ) {
        grunt.config("nodemailer.send.src", src)
      }
      else {
        console.warn("Email not found '%s'", email)
        return
      }
    }
    setCredentials()
    grunt.config("nodemailer.send.src", "rendered/*.html")
    grunt.task.run("nodemailer:send")
  })

  grunt.config("dustin.render", {
    options: {
      resolve: "template/",
      partials: "**/*.dust",
      // this target renders html files
      render: true,
      // Dust removes white space by default. Don't do that.
      preserveWhiteSpace: true,
      // create a global context from these json files
      // file names will be global properties
      data: "template/data/*.json",
      // execute these js files and let them register helpers
      helpers: "template/helpers/*.js"
    },
    expand: true,
    cwd: "mails/",
    src: "*.dust",
    dest: "rendered/",
    ext: ".html"
  })

  grunt.loadNpmTasks("grunt-dustin")
  grunt.loadNpmTasks("grunt-premailer")
  grunt.loadNpmTasks("grunt-nodemailer")

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
        files: ["template/**/*.dust", "mails/*.dust"],
        tasks: ["dustin:render", "premailer", "lr:html"]
      }
    })
    .started(function( options ){
      grunt.config("premailer.inline.options.baseUrl", options.host)
    })

}