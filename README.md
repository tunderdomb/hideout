hideout.js
=======

Another take on project scaffolding.
The twist is: self extracting modules.

The idea started with the frustration that came from using existing scaffolding tools.
They require you to write a lot of boilerplate code just to achive a single task.
Which is generally copy stuff, and maybe substitute some template variables.

This sounds so easy that it required an equally easy method to do so.
To top it with extra functionality, hideout project templates are self extracting.

Instead of lengthy explanation, here's a simple project:

    src/
      index.js
    .gitignore
    .npmignore
    hideout.js

Well this could be the structure of a lot of anything.
But the key is in the `hideout.js` file.
Let's say someone published this moduel on npm like `really-general-js-project`

When you want to use this project template, you say

    npm install really-general-js-project

And pretty much that's it. The project extracts itself into your current working dir.
I can hear you say "But npm installs into `node_modules`" and you're right. It is.
But the hideout templates run post install, and the magic is simple:
change the working dir to `../../` and run the hideout.js file.

Hideouts are written with a template dir-project dir relation in mind.
So when scaffolding, every read operation is relative to the template source,
and all writing is targeted on the project dir.

Installing hideout globally ensures that templates don't have to include them all the time

    npm install -g hideout

This installs the scaffolding api which templates can use.

The last bit of the magic happens in the `package.js`.
It goes like this:

    "scripts": {
      "install": "cd ../../ && hideout really-general-js-project"
    }

Executing this in your project root, hideout constructs a path to the template `hideout.js` and executes it.

(plugin == "really-general-js-project").

```js
path.join(cwd, "node_modules", plugin, "hideout.js")
```
And finally, here's what happens in the `hideout.js`:

```js
require("hideout")({defaults: true})
  .copy([
    "*",
    "!node_modules",
    "!package.json",
    "!hideout.js"
  ])
  .start(__dirname, function ( options ){
    console.log("All done!")
  })
```

To see what is hideout capable of, see the docs!
There are a lot of examples.

Oh, and there are stuff like predefined sequences, so you can cut down on things like
`npm init`. But more on that in the docs!

## License

MIT

Run with it!