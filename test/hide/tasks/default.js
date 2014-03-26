var tinylr = require('tiny-lr')()

function reservePorts( n, done ){
  var portscanner = require('portscanner')
  var os = require('os')
  var async = require("async")

  var MAX_PORTS = 30; // Maximum available ports to check after the specified port

  var IP = (function( ifaces ){
    for ( var dev in ifaces ) {
      var alias = 0;
      ifaces[dev].forEach(function ( details ){
        if ( details.family == 'IPv4' ) {
          console.log(dev + (alias ? ':' + alias : ''), details.address);
          ++alias;
          return details.address
        }
      });
    }
  }( os.networkInterfaces() ))

  async.map(new Array(n), function( i, done ){
    portscanner.findAPortNotInUse(8000+i, 8000 + i + MAX_PORTS, IP, function ( port ){
      done(port)
    })
  }, function( err, ports ){
    done(err, ports)
  })
}

var PORT_DEV = 8080
  , PORT_BUILD = 8081
  , PORT_LR = 8082

module.exports = function ( grunt ){

  grunt.loadNpmTasks('tiny-lr')

  grunt.config("watch", {
    options: {
      spawn: false,
      interrupt: true
    },
//      templates: {
//        files: [
//          "res/pages/**/*.mustache",
//          "res/pages/**/*.json",
//          "res/partials/**/*.mustache",
//          "res/helpers/**/*.js",
//          "res/data/**/*.json"
//        ],
//        tasks: ["bracer"]
//      },
//      stylist: {
//        files: [
//          "res/pages/**/*.mustache",
//          "res/partials/**/*.mustache"
//        ],
//        tasks: ["stylist"]
//      },
    style: {
      files: [
        "res/style/**/*.less",
        "res/partials/**/*.less",
        "res/pages/**/*.less"
      ],
      tasks: ["less", "newer:autoprefixer", "newer:lr:css"]
    }
  })

  grunt.config("connect", {
    dev: {
      options: {
        port: PORT_DEV,
        hostname: "*",
        base: "src/",
        // server will be kept alive by watch task
//        keepalive: true,
        livereload: PORT_LR,
        open: "http://localhost:" + PORT_DEV
      }
    },
    build: {
      options: {
        port: PORT_BUILD,
        hostname: "*",
        base: "build/",
        keepalive: true,
        open: "http://localhost:" + PORT_BUILD
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
    },
    font: {
      src: "src/static/font/**/*.{eot,svg,woff,ttf}"
    },
    js: {
      src: "src/script/**/*.js"
    }
  })

  grunt.registerMultiTask("lr", "", function (){
    var changedFiles = this.filesSrc
    if ( changedFiles.length ) {
      tinylr.changed({body: {files: changedFiles}})
    }
  })

  grunt.registerTask("default", "", function (){
    console.log("Grunt~~")
    reservePorts(3, function( ports ){
      grunt.config("connect.dev.options.port", ports[0])
      grunt.config("connect.build.options.port", ports[1])
      grunt.config("connect.dev.options.livereload", ports[2])

      grunt.event.once("connect.dev.listening", function (){
        // and let watch keep it alive
        grunt.task.run("watch")
      })

      // create lr server
      tinylr.listen(PORT_LR, function ( err ){
        console.log('LR Server Started')
        // open server
        grunt.task.run("connect:dev")
      })
    })
  })

};