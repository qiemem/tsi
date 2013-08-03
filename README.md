tsi
---

    A simple typescript REPL.
    Usage: tsi

    Options:
      -h, --help     Print this help message                           
      -f, --force    Force tsi to evaluate code with typescript errors.
      -v, --verbose  Print compiled javascript before evaluating.      

### Example:

    $ tsi
    >>> var square = (x: number) => x * x;
    undefined
    >>> square(5);
    25
    >>> square('foo');
    error TS2081: Supplied parameters do not match any signature of call target.
    error TS2087: Could not select overload for 'call' expression.
