
module.exports = function ( app ){

  app.use(function(err, req, res, next){
    app.get("log").error(err)
    switch ( req.headers.accept ) {
      case "application/json":
        res.send(err)
        break
      default :
        res.render("error", {
          errorCode: err.status,
          errorMessage: err.message
        })
    }
  })

}