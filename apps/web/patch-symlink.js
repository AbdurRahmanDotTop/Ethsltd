const fs = require('fs');
const originalSymlinkSync = fs.symlinkSync;
fs.symlinkSync = function(target, path, type) {
  try {
    originalSymlinkSync(target, path, type || 'junction');
  } catch (e) {
    if (e.code === 'EPERM') {
      try {
         const stat = fs.statSync(target);
         if (stat.isDirectory()) {
             originalSymlinkSync(target, path, 'junction');
         } else {
             fs.copyFileSync(target, path);
         }
      } catch(e2) {
          throw e;
      }
    } else {
      throw e;
    }
  }
}
import('file:///c:/Users/abdur/Downloads/Clients/Ethsltd/node_modules/.pnpm/@opennextjs+cloudflare@1.20.2_next@16.3.0_@babel+core@7.29.7_@types+node@20.19.43_react-dom@1_xtoenmxwk3cy4uytmzwyt2ysyi/node_modules/@opennextjs/cloudflare/dist/cli/index.js');
