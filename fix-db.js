const fs = require('fs');
const path = './services/api/src/routes/';
const files = ['admin-api-keys.ts', 'admin-audit.ts', 'admin-contracts.ts', 'admin-risk.ts', 'admin-system.ts'];

for (const f of files) {
  let content = fs.readFileSync(path + f, 'utf8');
  content = content.replace(/import \{ db \} from '\.\.\/db';\r?\n/, '');
  content = content.replace(/import \{ db \} from '\.\.\/db';/, '');
  content = content.replace(/import \{ Hono \} from 'hono';/, "import { Hono } from 'hono';\nimport { Bindings, Variables } from '../db';");
  content = content.replace(/const (admin[a-zA-Z]+Router) = new Hono\(\);/, 'const $1 = new Hono<{ Bindings: Bindings; Variables: Variables }>();');
  content = content.replace(/db\.select/g, "c.get('db').select");
  content = content.replace(/db\.update/g, "c.get('db').update");
  fs.writeFileSync(path + f, content);
}
console.log('Fixed DB imports');
