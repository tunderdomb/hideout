module.exports = function( hideout ){

  hideout
    /* prompts are mapped to inquirer */
    /* text input */
    .ask({
      name: "ask",
      message: "Ask",
      'default': "no title"
    })
    /* yes or no */
    .confirm({
      name: "confirm",
      message: "Confirm:",
      'default': true
    })
    /* select */
    .select({
      name: "select",
      message: "Select:",
      'default': "bar",
      choices: [ "foo", "bar", "bum" ]
    })
    /* check boxes */
    .selectMultiple({
      name: "selectMultiple",
      message: "Select Multiple",
      'default': "bar",
      choices: [ "foo", "bar", "bum" ]
    })
    /* route
    * this starts another route with the options collected so far */
    .route(function( options, route, done ){
      if ( options.confirm ) route
        .log("Another route")
        .start(__dirname, done)
      else done()
    })
    /* copy
    * src is relative to plugin dir
    * dest is relative to whatever the start() received as first argument
    * */
    .copy({
      src: "files/*.*",
      dest: "",
      // dest is the full path of the destination file
      // this should return the transformed string
      rename: function( dest ){
        return dest
      },
      // process the content of the file
      // this should return the processed content
      process: function( content ){
        return content
      }
    })
    /* read
    * just read the content of a file
    * err is null if the read was successful */
    .read("files/hideout.js", function( err, content, options, done ){
      console.log(content)
      done()
    })
    /* just like read but also tries to parse the content of the file as json */
    .readJSON("package.json", function( err, content, options, done ){
      console.log(content)
      done()
    })
    /* write a package json relative to the target dir */
    .package({
      name: "hello"
    })
    /* write a json file relative to the target */
    .writeJSON("bower.json", {
      name: "hello"
    })
    /* create a list of directories */
    .make(["src"])
    /* run a command */
    .run("dir", function( err, stdout, stderr, options ){
      console.log(stdout)
      console.log(stderr)
      if ( err !== null ) {
        console.log('exec error: ' + err)
      }
    })
    /* install npm modules
    * runs `npm install` with the modules passed in as an array
    * and adds the second argument after them
    * this will execute `npm install mkdirp --save-dev`*/
    .npmInstall(["mkdirp"], "--save-dev")
    /* start the prompt sequence
     * the first argument should be the target dir
     * a lot of options use this path to create file destinations
     *
     * */
    .start(__dirname, function( options ){
      console.log("Finished: ", options)
    })

}