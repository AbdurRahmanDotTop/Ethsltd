const fs = require('fs');
const path = require('path');

const apiClientPath = path.join(__dirname, '../packages/api-client/src/index.ts');
let content = fs.readFileSync(apiClientPath, 'utf8');

const positionMethods = `
  // Positions API Methods
  async getPositions() {
    return this.request<any[]>('/api/v1/trading/positions');
  }

  async closePosition(positionId: string, data?: { amount: number }) {
    return this.request<any>(\`/api/v1/trading/positions/\${positionId}/close\`, {
      method: 'POST',
      body: JSON.stringify(data || {})
    });
  }
`;

if (!content.includes('getPositions() {')) {
  // Insert before '// P2P API Methods'
  content = content.replace('// P2P API Methods', positionMethods + '\n  // P2P API Methods');
  fs.writeFileSync(apiClientPath, content, 'utf8');
  console.log('Successfully updated API client with Position methods');
} else {
  console.log('API client already has Position methods');
}
