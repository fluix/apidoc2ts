# apiDoc to Interfaces

Command line tool that generates typescript interfaces from your apiDoc documentation.

## Getting Started

### Installing

To use this tool install it using npm:

```
$ npm install apidoc2ts -g
```

### Usage

Get help on how to use the tool:

```
$ apidoc2ts --help
```

Generating interfaces from your apiDoc:

```
$ apidoc2ts --source ./doc/api_data.json --output generated --name interfaces.ts
```

#### Options

Required flags:

* `-s --source` - path to the `api_data.json` file from apiDoc
* `-o --output` - path to the output folder (default `./`)
* `-n --name` - name for the file with generated interfaces 

Additional flags:

* `-g --gropuing = (single|url)`:
    * `single` - create one file with all interfaces in it (not the best idea)
    * `url` - create multiple folders with interfaces corresponding to URL structure
* `-v --version = (last|all)` - which versions should be used
    * `last` - interfaces are generated only for the latest versions
    * `all` - interfaces are generated for all version and older version interfaces has a postfix `_vx.x.x`
* `-t --custom-types` - list of custom types that should not be replaced with strings
* `-w --whitelist` - list of endpoints names which should be processed, the rest of endpoints will be ignored
* `-e --parse-examples` - if example requests/responses should be parsed if no parameters are specified

Prefixes/postfixes for top-level interfaces names:
 
* `--static-prefix` - prefix for all interfaces names
* `--static-postfix` - postfix for all interfaces names
* `--request-prefix` - prefix for a request interface name
* `--request-postfix` - postfix for a request interface name
* `--response-prefix` - prefix for a response interface name
* `--response-postfix` - postfix for a response interface name
* `--error-prefix` - prefix for an error interface name
* `--error-postfix` - postfix for an error interface name

#### Config file

The tool will look for a default config file called `apidoc2ts.config.js` in a current folder and combine
flags from the file with a flags specified in command line. Note that command line flags override config
file flags and all flags in config file should be in a camelCase.

Also you can specify a path to the config file which **must** contain all required flags:

`-c --config` - path to the config file

Example of the config file:
```javascript
module.exports = {
    source: "source",
    name: "name.ts",
    output: "output",
    staticPrefix: "I",
    customTypes: ["type1", "type2"]
}
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
