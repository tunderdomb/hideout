module.exports = function( hideout ){

  hideout
//    .ask({
//      name: "ask",
//      message: "Ask",
//      'default': "no title"
//    })
//    .confirm({
//      name: "confirm",
//      message: "Confirm:",
//      'default': true
//    })
//    .select({
//      name: "select",
//      message: "Select:",
//      'default': "bar",
//      choices: [ "foo", "bar", "bum" ]
//    })
//    .selectMultiple({
//      name: "selectMultiple",
//      message: "Select Multiple",
//      'default': "bar",
//      choices: [ "foo", "bar", "bum" ]
//    })
//    .queue(function( options ){
//      return options.confirm
//    }, function( done ){
//      console.log("queue")
//      done()
//    })
//    .copy({
//      src: "files/*.*",
//      dest: "",
//      rename: function( dest ){
//        return dest
//      },
//      process: function( content ){
//        return content
//      }
//    })
//    .read("files/hideout.js", function( err, content, options, done ){
//      console.log(content)
//      done()
//    })
//    .readJSON("package.json", function( err, content, options, done ){
//      console.log(content)
//      done()
//    })
//    .package({
//      name: "hello"
//    })
//    .writeJSON("bower.json", {
//      name: "hello"
//    })
//    .make(["src"])
//    .run("dir", function( err, stdout, stderr ){
//      console.log(stdout)
//      console.log(stderr)
//      if ( err !== null ) {
//        console.log('exec error: ' + err)
//      }
//    })
//    .npmInstall(["mkdirp"])
    .start(__dirname, function( options ){
      console.log("Finished: ", options)
    })

}