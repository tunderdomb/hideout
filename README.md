hideout.js
=======

A really simple project scaffolding tool.
The whole thing is in beta, but a lot of things are possible even now.

Check out the docs folder's contents or the code itself,
it's very straightforward and heavily commented.

 There's also a builtins folder where you can find live examples of the usage of this tool.

 ## Install

    npm install -g hideout

## Usage

    hideout

and follow the prompts, or

    hideout <plugin_name>

to start a specific plugin.

Hideout loads plugins from three locations.

    - built in plugins
    - local plugins
    - global plugins

The search looks like this (the code is from the `bin/` of the installation):

```js
  [
    path.join(__dirname, "../builtins/*/"),
    path.join(cwd, "../node_modules/hideout-*/"),
    path.join(__dirname, "../../hideout-*/")
  ]
```

The default prompt will list you the plugins with their name.

## Writing a plugin

When executing a plugin, hideout looks for only one file, and that is a `hideout.js` at the plugin root.

```js
plugin = path.join(pluginRoot, "hideout.js")
```

The script should contain a single export function, with one argument.
It should look something like this:

```js
module.exports = function( hideout ){

  hideout
    .start(__dirname, function( options ){
      console.log(options)
    })

}
```

`hideout` is a `Hideout` instance. You can call the api methods on this instance.
By calling api methods in itself, a plugin does nothing.
You have to initiate the scaffolding with `start(dir, [done])`.
The first argument for `start()` is mandatory.
A lot of api methods accept paths to read files from the plugin dir.
Because these are all relative paths, they will be resolved to this dir.
So it should be the root directory of the plugin (`__dirname`).

Look at the built in modules for an extended example, they are pretty easy to grasp.
The code is also self documented.
