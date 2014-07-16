var path = require("path")
var express = require("express")
var directory = require('serve-index')

module.exports = function( app ){
  app.use(express.static(path.join(process.cwd(), "public/downloads"), {
    setHeaders: function( res, path ){
      res.attachment(path)
    }
  }))
  app.use(express.static(path.join(process.cwd(), "public"), {
    maxAge: 1000*60*60*24*7
  }))
  app.use(directory("public", {icons: true}))
}