var hideout = require("../hideout")

hideout.fs.read("package.json")
  .then(hideout.transforms.json.parse())
  .then(function(packageJson) {
    packageJson.dependencies = {}
    return packageJson
  })
  .then(hideout.transform.json.stringify())
  .then(function(packageJson) {
    return hideout.write.promise("package.json", packageJson)
  })


/* 1 */
hideout.fs.src("./*.*").then(hideout.fs.remove())


/* 2 */
hideout.fs.src("./*.*").then(function(files) {
  return hideout.fs.read(files)
})


/* 3 */
hideout.fs.src("./*.*").then(hideout.fs.read)


/* 4 */
hideout.fs.src("./*.*", function(promise) {
  promise.then(hideout.fs.read())
})


/* 5 */
hideout.fs.src("./*.*", function(files) {
  return files.forEach(function(file) {
    return hideout.fs.read(file)
  })
})


/* 6 */
hideout.fs.src("./*.*").forEach(function(file) {
  return hideout.fs.read(file)
})


/* 7 */
hideout.fs.src("./*.*").then(function(files) {
  files.forEach(function(file) {
    hideout.fs.read(file)
  })
})


/* 8 */
hideout.fs.src("./*.*").then(function(files) {
  return Promise.all(files.map(function(file) {
    return hideout.fs.read(file)
  }))
})
