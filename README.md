tsi
---

    A simple typescript REPL.
    Usage: tsi

    Options:
      -h, --help     Print this help message                           
      -f, --force    Force tsi to evaluate code with typescript errors.
      -v, --verbose  Print compiled javascript before evaluating.      

### Installation

tsi runs on node.js and can easily be installed through npm.

    npm install -g tsi

### Building

The `bin` directory includes the current build of tsi. If you would like to
rebuild it though, just run

    npm run-script build

### Example

    $ tsi
    > var square = (x: number) => x * x;
    undefined
    > square(5);
    25
    > square('foo');
    error TS2081: Supplied parameters do not match any signature of call target.
    error TS2087: Could not select overload for 'call' expression.
