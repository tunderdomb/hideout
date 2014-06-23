module.exports = function ( hideout ){
  console.log("hello")
  hideout
    .copy([
      "Gruntfile.js",
      "npm-shrinkwrap.json",
      "package.json",
      "recipients.json",
      "tasks/*.js",
      "example/*.*",
      "template/**/*.*",
      "README.md"
    ])
    .make([
      "rendered",
      "rendered/img",
      "template/mails"
    ])
    .log("npm install ...")
    .npmInstall()
    .start(__dirname, function (  ){
      console.log("Done!")
    })

}