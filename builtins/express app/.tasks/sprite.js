var fs = require("fs")
var path = require("path")

var SPRITE_INDEX = path.join(process.cwd(), ".config/sprites.json")

var SPRITES_DIR = ".gen/sprite/"
var IMAGES_DIR = "public/static/img/sprite/"
var SPRITE_URL = "/static/img/sprite/"
var STYLES_DIR = "style/sprite"

var DEFAULT_OPTIONS = {
  // OPTIONAL: Specify algorithm (top-down, left-right, diagonal [\ format],
  // alt-diagonal [/ format], binary-tree [best packing])
  // Visual representations can be found below
  algorithm: "binary-tree",

  // OPTIONAL: Specify padding between images
  padding: 2,

  // OPTIONAL: Specify engine (auto, phantomjs, canvas, gm, pngsmith)
  engine: "gm",

  // OPTIONAL: Specify settings for algorithm
//  algorithmOpts: {
//    // Skip sorting of images for algorithm (useful for sprite animations)
//    sort: false
//  },

  // OPTIONAL: Specify img options
  imgOpts: {
    // Format of the image (inferred from destImg" extension by default) (jpg, png)
//    format: "png",

    // gm only: Quality of image
    quality: 90

    // phantomjs only: Milliseconds to wait before terminating PhantomJS script
//    timeout: 10000
  }
}

function options( setup, defaults ){
  for ( var prop in defaults ) {
    if ( setup[prop] == undefined ) setup[prop] = defaults[prop]
  }
  return setup
}

function getSprites(){
  var sprites = JSON.parse(fs.readFileSync(SPRITE_INDEX, "utf8"))
//  var opt = sprites.options
  delete sprites.options
//  var resolve = SPRITES_DIR
  var target
  var targets = {}
  for ( var dest in sprites ){
    //
    target = path.basename(dest, path.extname(dest))
    target = targets[target] = options(sprites[dest], DEFAULT_OPTIONS)

    // Location to output spritesheet
    target.destImg = path.join(IMAGES_DIR, dest)
    // Stylus with variables under sprite names
    target.destCSS = path.join(STYLES_DIR, target.destCSS)
    // OPTIONAL: Manual override for imgPath specified in CSS
    target.imgPath = path.join(SPRITE_URL, dest).replace(/\\/g, "/")

    // Sprite files to read in
    target.src = typeof target.src == "string"
      ? path.join(SPRITES_DIR, target.src).replace(/\\/g, "/")
      : target.src.map(function ( src ){
          return path.join(SPRITES_DIR, src).replace(/\\/g, "/")
        })
  }
  return {
    options: sprites.options,
    targets: targets
  }
}

function config( grunt ){

  var sprites = getSprites()

  grunt.config("sprite", sprites.targets)

  grunt.config("lr.sprite", {
    src: path.join(IMAGES_DIR, "**/*.{jpe?g,png,gif,svg}")
  })

}

module.exports = function ( grunt ){

  grunt.config("watch.sprite", {
    files: [
      path.join(SPRITES_DIR, "**/*.{jpe?g,png,gif,svg}"),
      SPRITE_INDEX
    ],
    tasks: ["renderSprites", "lr:sprite"]
  })

  grunt.registerTask("renderSprites", function (){
    try {
      config(grunt)
      grunt.task.run("sprite")
    }
    catch ( e ) {
      console.error(e)
    }
  })

  config(grunt)
}