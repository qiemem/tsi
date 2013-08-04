/// <reference path="../lib/node.d.ts" />

import readline = module("readline");
import vm = module("vm");

var typescript = require("typescript.api");
var options = require('optimist')
    .usage('A simple typescript REPL.\nUsage: $0')
    .alias('h', 'help')
    .describe('h', 'Print this help message')
    .alias('f', 'force')
    .describe('f', 'Force tsi to evaluate code with typescript errors.')
    .alias('v', 'verbose')
    .describe('v', 'Print compiled javascript before evaluating.'),
    argv = options.argv;

if (argv.h) {
  options.showHelp();
  process.exit(1);
}


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var defaultPrompt = '>>> ',
	moreLinesPrompt = '... ',
    declarations = [
      __dirname+'/../node_modules/typescript.api/decl/ecma.d.ts',
      __dirname+'/../node_modules/typescript.api/decl/node.d.ts'
    ],
    defaultPrefix = '',
    context = {},
    verbose = argv.v,
    force = argv.f;

typescript.resolve(declarations, function (sourceUnits) {
  function repl(prompt: string, prefix: string) {
    rl.question(prompt, function(code) {
      var code = prefix + '\n' + code,
          openCurly = (code.match(/\{/g) || []).length,
          closeCurly = (code.match(/\}/g) || []).length,
          openParen = (code.match(/\(/g) || []).length,
          closeParen = (code.match(/\)/g) || []).length;
      if (openCurly === closeCurly && openParen === closeParen) {
        var newSourceUnits = sourceUnits.concat([
          typescript.create(sourceUnits.length + '.ts', code)
        ]);
        typescript.compile(newSourceUnits, function (compiled) {
          var current = compiled[compiled.length - 1];
          if (verbose) {
            console.log(current.content);
          }
          for (var i = 0; i < current.diagnostics.length; i++) {
            console.log(current.diagnostics[i].message);
          }
          if (force || current.diagnostics.length === 0) {
            sourceUnits = newSourceUnits;
            try {
              console.log(vm.runInNewContext(current.content, context));
            } catch (e) {
              console.log(e.stack);
            }
          }
          repl(defaultPrompt, defaultPrefix);
        });
      } else {
        repl(moreLinesPrompt, code);
      }
    });
  }
  repl(defaultPrompt, defaultPrefix);
});

