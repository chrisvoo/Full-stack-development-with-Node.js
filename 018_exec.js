'use strict';
const cp = require('child_process');
const child = cp.execFile('node', ['-i'], (err, stdout, stderr) => {
  console.log(stdout);
});

child.stdin.write('process.versions;\n');
// ends the input
child.stdin.end();
