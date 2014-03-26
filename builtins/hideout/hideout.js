module.exports = function( hideout ){

  hideout
    .ask({
      name: "ask",
      message: "Ask",
      'default': "no title"
    }, function( options ){
      return true
    })
    .confirm({
      name: "confirm",
      message: "Confirm:",
      'default': true
    }, function( options ){
      return true
    })
    .select({
      name: "select",
      message: "Select:",
      'default': "bar",
      choices: [ "foo", "bar", "bum" ]
    }, function( options ){
      return true
    })
    .selectMultiple({
      name: "selectMultiple",
      message: "Select Multiple",
      'default': "bar",
      choices: [ "foo", "bar", "bum" ]
    }, function( options ){
      return true
    })
    .queue(function( options ){
      return options.confirm
    }, function( done ){
      console.log("hello")
      done()
    })
//    .copy("src", "dest", function( options ){
//      return true
//    })
//    .process("src", "dest", function( content ){
//      return content
//    }, function( options ){
//      return true
//    })
//    .run("command", function( options ){
//      return true
//    })
//    .read("src", function( content ){
//      return content
//    }, function( options ){
//      return true
//    })
//    .readJSON("src", function( content ){
//      return content
//    }, function( options ){
//      return true
//    })
    .start(function( options ){
      console.log(options)
    })

}