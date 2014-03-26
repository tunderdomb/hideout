module.exports = function( hideout ){

  hideout
    .ask({
      name: "name",
      message: "Name",
      validate: function( input ){
        return /^[\w]+$/.test(input)
      }
    })
    .confirm({
      name: "multitask",
      message: "Is this a multitask?",
      'default': true
    })
    .start(function( options ){
      console.log(options)
    })

}