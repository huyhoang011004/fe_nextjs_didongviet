const fs = require('fs');
const path = require('path');

// Script cập nhật biến môi trường
// - NEXT_PUBLIC_API_BASE_URL hoặc API_URL (base URL) → process.env.NEXT_PUBLIC_API_URL
// - NEXT_PUBLIC_API_URL với fallback 'http://localhost:5000/api/v1' → NEXT_PUBLIC_API_URL + '/api/v1'

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      // 1. Thay NEXT_PUBLIC_API_BASE_URL → NEXT_PUBLIC_API_URL
      content = content.replace(
        /process\.env\.NEXT_PUBLIC_API_BASE_URL \|\| 'http:\/\/localhost:5000'/g,
        "process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'"
      );
      content = content.replace(
        /process\.env\.NEXT_PUBLIC_API_BASE_URL/g,
        "process.env.NEXT_PUBLIC_API_URL"
      );

      // 2. Thay API_URL (server-side biến) → NEXT_PUBLIC_API_URL
      content = content.replace(
        /const API_URL = process\.env\.API_URL \|\| 'http:\/\/localhost:5000';/g,
        "const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';"
      );
      content = content.replace(
        /process\.env\.API_URL \|\| 'http:\/\/localhost:5000'/g,
        "process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'"
      );

      // 3. Thay NEXT_PUBLIC_API_URL fallback '/api/v1' → thêm /api/v1 vào base URL
      content = content.replace(
        /process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:5000\/api\/v1'/g,
        "(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1'"
      );
      content = content.replace(
        /`\$\{process\.env\.NEXT_PUBLIC_API_URL\}\/products\//g,
        "`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')}/api/v1/products/"
      );

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done!');
