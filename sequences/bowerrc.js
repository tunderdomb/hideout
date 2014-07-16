module.exports = function( hideout ){

  hideout
    .log("Setup .bowerrc file..")
    .route(function( options, route, done ){
      route
        .ask({
          name: "directory",
          message: ".bowerrc directory",
          'default': options.bowerrcDir || "src/script"
        }, function( options ){
          return !options.defaults
        })
        .start(done)
    })
    .route(function( options, route, done ){
      route
        .writeJSON(".bowerrc", {
          directory: options.directory
        })
        .start(done)
    })
}