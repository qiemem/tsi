/// <reference path="node.d.ts" />

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
    context = {},
    verbose = argv.v,
    force = argv.f,
	sourceUnits = [],
    sourceNumber = 0;

function repl(prompt: string, prefix: string) {
  rl.question(prompt, function(code) {
    var code = prefix + '\n' + code,
        openCurly = (code.match(/\{/g) || []).length,
        closeCurly = (code.match(/\}/g) || []).length,
        openParen = (code.match(/\(/g) || []).length,
        closeParen = (code.match(/\)/g) || []).length;
    if (openCurly === closeCurly && openParen === closeParen) {
	  sourceNumber++;
      sourceUnits.push(typescript.create(sourceNumber + '.ts', code));
      typescript.compile(sourceUnits, function (compiled) {
		var current = compiled[sourceUnits.length - 1];
        if (verbose) {
          console.log(current.content);
        }
        for (var i = 0; i < current.diagnostics.length; i++) {
          console.log(current.diagnostics[i].message);
        }
        try {
          console.log(vm.runInNewContext(current.content, context));
        } catch (e) {
          console.log(e.stack);
        }
        repl(defaultPrompt, '');
      });
    } else {
      repl(moreLinesPrompt, code);
    }
  });
}

repl(defaultPrompt, '');

