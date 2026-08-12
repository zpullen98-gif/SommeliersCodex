// Parse every layer and data file without running it.
//
//   node .scripts/check-syntax.js
//
// The app is ~20 classic scripts sharing one global scope, so a single stray
// character takes the whole stack down: the file with the typo stops parsing,
// every global it defines goes missing, and the console fills with
// "X is not defined" from the layers above — pointing everywhere except the
// actual mistake. Run this after any bulk edit to the copy.
//
// The mistake that prompted it: a rename put possessive apostrophes ("Page's",
// "squire's") inside single-quoted JS string literals, which terminated them.

const fs = require('fs'), path = require('path');
const JS = path.join(__dirname, '..', 'js');

let bad = 0, n = 0;
for (const f of fs.readdirSync(JS).filter(x => x.endsWith('.js')).sort()) {
  n++;
  const src = fs.readFileSync(path.join(JS, f), 'utf8');
  try {
    new Function(src);                      // parses without executing
  } catch (e) {
    bad++;
    console.log('  BROKEN  ' + f + '  ::  ' + e.message);
    // narrow it down: find the first line that fails to parse cumulatively
    const lines = src.split('\n');
    for (let i = 1; i <= lines.length; i++) {
      try { new Function(lines.slice(0, i).join('\n')); } catch (err) {
        if (i === lines.length || /Unexpected|Invalid|missing/.test(err.message)) continue;
      }
    }
  }
}
console.log(bad ? '\n' + bad + ' of ' + n + ' files failed to parse'
                : 'all ' + n + ' JS files parse');
process.exit(bad ? 1 : 0);
