const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../src/renderer');
let hasError = false;
function scan(p) {
  const stat = fs.statSync(p);
  if (stat.isDirectory()) {
    for (const f of fs.readdirSync(p)) {
      scan(path.join(p, f));
    }
  } else if (p.endsWith('.js')) {
    const lines = fs.readFileSync(p, 'utf8').split(/\n/);
    lines.forEach((line, i) => {
      const m = line.match(/^\s*import\s.*?from\s+["']([^"']+)["']/);
      if (m) {
        const spec = m[1];
        if (!spec.startsWith('./') && !spec.startsWith('../') && !spec.startsWith('https://')) {
          console.error(`Bare import '${spec}' in ${path.relative(process.cwd(), p)}:${i+1}`);
          hasError = true;
        }
      }
    });
  }
}
scan(dir);
if (hasError) {
  process.exit(1);
}
