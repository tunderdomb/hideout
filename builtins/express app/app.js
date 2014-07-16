
// start app

var express = require("express")
var app = express()
require("./app/index")(app)
app.listen(process.env.PORT || 8002)
app.get("log").info("server started on %d", process.env.PORT || 8002)