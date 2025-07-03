const {readFileSync,writeFileSync} = require('fs');
const pkg = require('../package.json');
writeFileSync('dist/version.json', JSON.stringify({version:pkg.version}));
['index.html','about.html'].forEach(f=>{
  const txt = readFileSync(f,'utf8')
    .replace(/v\d+\.\d+\.\d+/g, 'v'+pkg.version);
  writeFileSync(f,txt);
});
