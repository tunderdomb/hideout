
// setup app
var bunyan = require("bunyan")
var log = bunyan.createLogger({
  name: "todo",
  streams: [{
    path: process.cwd()+"/logs/log2.json"
  }]
})

var dustin = require("grunt-dustin")
var adapter = dustin({
  cache: false,
  preserveWhiteSpace: false,
  helpers: "view/helpers/**/*.js",
  data: "view/data/**/*.json",
  resolve: "view/"
})

module.exports = function( app ){
  app.set("log", log)

  app.engine("dust", adapter.__express)
  app.set("view engine", "dust")
  app.set("views", "view/")
  app.set("view cache", false)

//  app.use(favicon(process.cwd() + '/public/static/favicon.ico'))

  app.use(require('cookie-parser')())

  require("./routes/pages")(app)
  require("./routes/static")(app)
  require("./routes/errors")(app)
}