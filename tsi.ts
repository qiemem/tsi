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
    verbose = argv.v || argv.verbose;

function repl(prompt: string, prefix: string) {
  rl.question(prompt, function(code) {
    var code = prefix + '\n' + code,
        openCurly = (code.match(/\{/g) || []).length,
        closeCurly = (code.match(/\}/g) || []).length,
        openParen = (code.match(/\(/g) || []).length,
        closeParen = (code.match(/\)/g) || []).length;
    if (openCurly === closeCurly && openParen === closeParen) {
      var source = typescript.create('temp.ts', code);
      typescript.compile([source], function (compiled) {
        if (verbose) {
          console.log(compiled[0].content);
        }
        for (var i = 0; i < compiled[0].diagnostics.length; i++) {
          console.log(compiled[0].diagnostics[i].message);
        }
        try {
          console.log(vm.runInNewContext(compiled[0].content, context));
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

