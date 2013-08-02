/// <reference path="node.d.ts" />

import readline = module("readline");
import vm = module("vm");
var typescript = require("typescript.api");
var argv = require('optimist').argv;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var defaultPrompt = '>>> ',
	moreLinesPrompt = '... ',
    context = {},
    verbose = argv.v || argv.verbose,
	sourceUnits = [],
	sourceNumber = 0;;

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

