var path = require("path")
var fs = require("fs")

module.exports = function ( grunt ){

  grunt.loadNpmTasks("grunt-nodemailer")

  grunt.config("nodemailer.send", {
    options: {
      transport: {
        type: 'SMTP',
        options: {
          service: 'Gmail',
          auth: {
            user: "john.doe@gmail.com",
            pass: "password"
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
    if ( !process.env.USER || !process.env.PASSWORD ) {
      console.warn("Couldn't send mail: Missing auth details")
      console.log("You can set login credential with environment variables USER and PASSWORD.")
      return
    }
    var recipients = []
    try{
      recipients = JSON.parse(grunt.file.read("recipients.json"))
    }
    catch (e){
      console.log("Couldn't find recipients:")
      console.warn(e)
      return
    }
    if ( email ) {
      var src = path.concat(__dirname, "rendered", email + ".html")
      if ( grunt.file.exists(src) ) {
        console.log("Sending %s to %d recipients", src, recipients.length)
        grunt.config("nodemailer.send.src", src)
      }
      else {
        console.warn("Email not found '%s'", email)
        return
      }
    }
    else {
      console.log("Sending all mail to %d recipients", recipients.length)
    }
    grunt.config("nodemailer.send.options.recipients", recipients)
    grunt.config("nodemailer.send.src", "rendered/*.html")
    grunt.config("nodemailer.send.options.transport.auth", {
      "user": process.env.USER,
      "pass": process.env.PASSWORD
    })

    grunt.task.run("nodemailer:send")
  })

}