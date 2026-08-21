const fs = require('fs');
const path = './services/api/src/routes/';
const files = fs.readdirSync(path).filter(f => f.startsWith('admin-'));

for (const f of files) {
  let content = fs.readFileSync(path + f, 'utf8');
  content = content.replace(/\$admin[a-zA-Z]*Router\.use\('\*', adminMiddleware\);\r?\n/g, '');
  const routerNameMatch = content.match(/const (admin[a-zA-Z]+Router) = new Hono\(\);/);
  if (routerNameMatch) {
    const rName = routerNameMatch[1];
    // Remove if already exists so we don't duplicate
    content = content.replace(new RegExp(rName + '\\.use\\(\\'\\*\\', adminMiddleware\\);\\r?\\n', 'g'), '');
    
    // Add it after requireAuth
    content = content.replace(
      new RegExp(rName + '\\.use\\(\\'\\*\\', requireAuth\\);'), 
      `${rName}.use('*', requireAuth);\n${rName}.use('*', adminMiddleware);`
    );
    fs.writeFileSync(path + f, content);
  }
}
console.log('Done');
