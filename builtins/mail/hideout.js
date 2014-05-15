module.exports = function( hideout ){

  hideout
    .sequence("npmInit")
    .copy({
      src: "Gruntfile.js"
    })
    .make([
      "mail",
      "rendered",
      "template/component",
      "template/data",
      "template"
    ])
    .npmInstall(["grunt", "grunt-dustin", "grunt-nodemailer", "grunt-premailer", "boomer"])
    .start(__dirname, function( options ){
      console.log(options)
    })

}