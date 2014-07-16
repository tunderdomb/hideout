module.exports = function ( app ){
  var log = app.get("log")

  app.get("/", function( req, res, next ){
    res.render("index")
  })
}