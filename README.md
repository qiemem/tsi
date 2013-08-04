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

### Caveats

You can't change the type of variable after it's been declared:

    $ tsi
    > var x = 5;
    undefined
    > x = 'hi';
    error TS2011: Cannot convert 'string' to 'number'.

You can't redeclare variables (in particular, to get around the previous caveat):

    $ tsi
    > var x = 1;
    undefined
    > var x = 'hi';
    error TS2000: Duplicate identifier 'x'.
