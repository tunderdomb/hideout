hideout.js
=======

Another take on project scaffolding. Now with less decoration and more focus on actual scaffolding.

The problem with current scaffolding tools is that
they require you to write a lot of boilerplate code just to achieve a single task.
Which is generally copy stuff, and maybe substitute some template variables.

This sounds so easy that it required an equally easy method to do so.
Plus you don't have to structure your project template in any special way,
nor will you get lost in configuring simple tasks.

Hideout is straightforward and easy to use/read.
Plenty of convenient features are provided for common stuff.

## Install

    npm install -g hideout

## Example

A simple project structure:

    index.js
    .gitignore
    package.json
    README.md
    hideout.js

Let's say we published this module on npm like `hideout-bare-minimum`

**Note:** it's essential to prefix the template with `hideout-` because that's what the resolver looks for.

When you want to use this template, you say

    mkdir new-project
    cd new-project
    npm install hideout-bare-minimum
    hideout bare-minimum

or globally once, so it can be used any time you need it

    npm install hideout-bare-minimum -g
    hideout bare-minimum

In any case hideout will find it, and will look for it in the above order.
First locally, then globally.

Hideouts are written with a template-project relation in mind.
So when scaffolding, every read operation is relative to the template source,
and all writing is targeted on the project dir.

All the scaffolding logic is in the `hideout.js` file.
Here's what happens in it:

```js
module.exports = function( hideout ){
  hideout
    .copy([
      "*",
      ".gitignore",
      "!hideout.js"
    ])
    .start(__dirname, function ( options ){
      console.log("All done!")
    })
}
```

To see what is hideout capable of, see the docs!
There are a lot of examples.

Oh, and there are stuff like predefined sequences, so you can cut down on things like
`npm init`. But more on that in the docs!

## License

MIT

Run with it!