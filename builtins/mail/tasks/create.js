module.exports = function ( grunt ){
  grunt.registerTask("create", function ( name ){
    if ( !name ) {
      console.warn("Missing mail name")
      return
    }
    var layout = "template/layout/create.dust"
    var src = "template/mails/"+name+".dust"
    grunt.file.copy(layout, src, {
      process: function( content ){
        return content
          .replace(/<title>.*?<\/title>/, "<title>"+name+"</title>")
      }
    })
    console.log("Created %s", src)
  })
}