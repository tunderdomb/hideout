var boomer = require("boomer")

module.exports = function ( grunt ){

  grunt.config("concat", {})

  grunt.config("dustin.options", {
    resolve: "res/",
    partials: "**/*.dust",
    setup: function( adapter, dust ){}
  })
  grunt.config("dustin.render", {
    options: {
      // this target renders html files
      render: true,
      // Dust removes white space by default. Don't do that.
      preserveWhiteSpace: true,
      // create a global context from these json files
      // file names will be global properties
      data: "res/data/*.json",
      // execute these js files and let them register helpers
      helpers: "res/helpers/*.js"
    },
    expand: true,
    cwd: "res/pages/",
    src: ["**/*.dust"],
    dest: "src/page/",
    ext: ".html"
  })
  // compile options
  grunt.config("dustin.compile", {
    copyClientLibs: {
      options: {
        client: "src/script/lib/dustin/",
        resolve: "templates/"
      }
    },
    compile: {
      options: {
        compile: true,
        // we don't care about white space in compiled templates
        preserveWhiteSpace: false
      },
      expand: true,
      cwd: "res/",
      src: ["**/*.dust"],
      dest: "src/templates/",
      ext: ".js"
    }

  })

  grunt.config("stylist", {
    options: {
      classes: true,
      ids: true,
      data: false,
      ignore: "res/style/**/*.less"
    },
    extract: {
      expand: true,
      cwd: "res",
      src: ["**/*.dust"],
      dest: "res/style/",
      ext: ".less"
    }
  })

  grunt.config("less", {
    options: {
      cleancss: true,
      strictMath: true
    },
    preprocess: {
      expand: true,
      flatten: true,
      cwd: "res/style/",
      src: ["*.less"],
      dest: "src/static/css/",
      ext: ".css"
    }
  })

  grunt.config("autoprefixer", {
    prefix: {
      options: {
        browsers: [
          "last 10 Chrome versions",
          "last 3 ie versions",
          "last 10 ff versions",
          "last 10 Opera versions",
          "last 10 Safari versions",
          "last 3 iOS versions",
          "Android >= 2"
        ]
      },
      expand: true,
      cwd: "src/static/css/",
      src: "*.css",
      dest: "src/static/css/"
    }
  })

  boomer(grunt, "default")
    .connect({
      hostname: "*",
      base: "src/"
    })
    .lr({
      html: "src/**/*.html",
      css: "src/static/css/*.css",
      js: "src/script/**/*.js",
      img: "src/media/image/**/*.{jpe?g,png,gif,svg}",
      template: "src/template/*.js"
    })
    .watch({
      options: {
        spawn: false,
        interrupt: true
      },
      html: {
        files: [
          "res/data/*.json",
          "res/**/*.dust"
        ],
        tasks: ["dustin:render", "newer:stylist", "lr:html"]
      },
      img: {
        files: "src/media/image/**/*.{jpe?g,png,gif,svg}",
        tasks: ["newer:lr:img"]
      },
      css: {
        files: [
          "res/style/**/*.less"
        ],
        tasks: ["less", "newer:autoprefixer", "newer:lr:css"]
      },
      js: {
        files: [
          "src/script/**/*.js",
          "src/template/*.js"
        ],
        tasks: ["newer:lr:js"]
      }
    })

}