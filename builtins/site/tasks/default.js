
var tinylr = require('tiny-lr')()
var portscanner = require('portscanner')
var os = require('os')
var async = require("async")

var MAX_PORTS = 30 // Maximum available ports to check after the specified port

var IP = (function( ifaces ){
  for ( var dev in ifaces ) {
    var alias = 0;
    ifaces[dev].forEach(function ( details ){
      if ( details.family == 'IPv4' ) {
        console.log(dev + (alias ? ':' + alias : ''), details.address)
        ++alias
        return details.address
      }
    })
  }
}( os.networkInterfaces() ))

function reservePorts( n, done ){
  async.map(new Array(n), function( i, done ){
    portscanner.findAPortNotInUse(8000+i, 8000 + i + MAX_PORTS, IP, function ( port ){
      done(port)
    })
  }, function( err, ports ){
    done(err, ports)
  })
}

module.exports = function ( grunt ){

  grunt.config("connect", {
    serve: {
      options: {
        port: "",
        hostname: "*",
        base: "src/",
        livereload: "",
        open: ""
      }
    }
  })
  grunt.config("lr", {
    html: {
      src: "src/*.html"
    },
    css: {
      src: "src/static/css/*.css"
    },
    img: {
      src: "src/media/image/**/*.{jpg,jpeg,png,gif,svg}"
    }
  })

  grunt.registerMultiTask("lr", "", function (  ){
    var changedFiles = this.filesSrc
    if ( changedFiles.length ) {
      tinylr.changed({body: {files: changedFiles}})
    }
  })
  grunt.registerTask("default", "", function(  ){
    console.log("Grunt~~")
    reservePorts(2, function( ports ){
      grunt.config("connect.mail.options.port", ports[0])
      grunt.config("connect.mail.options.livereload", ports[1])

      grunt.event.once("connect.mail.listening", function (){
        // and let watch keep it alive
        grunt.task.run("watch")
      })

      // create lr server
      tinylr.listen(ports[1], function ( err ){
        console.log('LR Server Started')
        // open server
        grunt.task.run("connect:mail")
      })
    })
  })

}