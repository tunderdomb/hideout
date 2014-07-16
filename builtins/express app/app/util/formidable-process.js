var formidable = require("formidable")

module.exports = function transform( req, process, done ){
    var form = new formidable.IncomingForm()
      , files = {}

    form.onPart = function ( part ){
      if ( !part.filename ) {
        // let formidable handle all non-file parts
        form.handlePart(part)
      }
      else {
        ++form._flushing
        process(part, function( err, result ){
          if( !err ) {
            files[part.name] = result
          }
          --form._flushing
          form._maybeEnd()
        })
      }
    }

    form.parse(req, function( err, fields ){
      done(err, fields, files)
    })

    return form
  }
