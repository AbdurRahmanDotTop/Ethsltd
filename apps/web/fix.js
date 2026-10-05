const fs = require('fs');

function fixNull(file, regex, replacement) {
  const p = 'src/' + file;
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    fs.writeFileSync(p, c.replace(regex, replacement));
  }
}

// 1.
fixNull('app/(dashboard)/support/tickets/[id]/page.tsx', /const unwrappedParams = use\(params\);/, 'const unwrappedParams = use(params) || {id: ""};');
// 2.
fixNull('app/admin/support/tickets/[id]/page.tsx', /const unwrappedParams = use\(params\);/, 'const unwrappedParams = use(params) || {id: ""};');
// 3.
fixNull('components/auth/LoginForm.tsx', /const searchRedirect = searchParams\.get\("redirect"\);/, 'const searchRedirect = searchParams?.get("redirect");');
// 4.
fixNull('components/auth/ResetPasswordForm.tsx', /const token = searchParams\.get\('token'\);/, "const token = searchParams?.get('token');");
// 5.
fixNull('components/auth/EmailVerification.tsx', /const token = searchParams\.get\('token'\);/, "const token = searchParams?.get('token');");
// 6.
fixNull('components/admin/AdminSidebar.tsx', /const isActive = pathname === item\.href/, "const isActive = pathname === item.href || (pathname || '').startsWith(item.href + '/');");
// 7.
fixNull('components/auth/AuthProvider.tsx', /if \(pathname\.startsWith/, 'if (pathname?.startsWith');
fixNull('components/auth/AuthProvider.tsx', /encodeURIComponent\(pathname\)/, "encodeURIComponent(pathname || '')");
// 8.
fixNull('app/experts/[id]/page.tsx', /const id = unwrappedParams\.id;/, "const id = unwrappedParams?.id || '';");
