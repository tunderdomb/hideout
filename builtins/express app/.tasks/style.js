var STYLE_ROOT = "style/"
var CSS_ROOT = "public/static/css/"

var BROWSERS = [
  "last 10 Chrome versions",
  "last 3 ie versions",
  "last 10 ff versions",
  "last 10 Opera versions",
  "last 10 Safari versions",
  "last 3 iOS versions",
  "Android >= 2"
]

module.exports = function ( grunt ){

  grunt.config("stylist", {
    options: {
      classes: true,
      ids: true,
      data: false,
      ignore: STYLE_ROOT+"**/*.less"
    },
    extract: {
      expand: true,
      cwd: "view",
      src: ["**/*.dust"],
      dest: STYLE_ROOT,
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
      cwd: STYLE_ROOT,
      src: ["*.less"],
      dest: CSS_ROOT,
      ext: ".css"
    }
  })

  grunt.config("autoprefixer", {
    prefix: {
      options: {
        browsers: BROWSERS
      },
      expand: true,
      cwd: CSS_ROOT,
      src: "*.css",
      dest: CSS_ROOT
    }
  })

  grunt.config("watch.css", {
    files: [
      STYLE_ROOT+"**/*.less"
    ],
    tasks: ["less", "newer:autoprefixer", "newer:lr:css"]
  })

}