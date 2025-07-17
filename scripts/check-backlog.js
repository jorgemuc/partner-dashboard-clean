const fs = require('fs');
const lines = fs.readFileSync('BACKLOG.csv', 'utf8').trim().split(/\r?\n/);
let ok = true;
for (const [i, line] of lines.entries()) {
  const cols = line.split(',');
  if (cols.length !== 7) {
    console.error(`Line ${i + 1} has ${cols.length} columns`);
    ok = false;
  }
}
if (!ok) process.exit(1);
