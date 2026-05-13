import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/login', '/register'];

// Maps backend role values to their allowed route prefixes
const ROLE_ROUTES: Record<string, string[]> = {
  resident: ['/resident'],
  staff: ['/staff', '/resident'],
  department_admin: ['/dept-admin', '/staff', '/resident'],
  super_admin: ['/super-admin', '/dept-admin', '/staff', '/resident'],
};

// Maps backend role values to their default dashboard
const ROLE_DASHBOARDS: Record<string, string> = {
  resident: '/resident',
  staff: '/staff',
  department_admin: '/dept-admin',
  super_admin: '/super-admin',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Read auth state from cookies (set by login page)
  const token = request.cookies.get('civic-token')?.value;
  const userRole = request.cookies.get('civic-role')?.value;

  // Public routes: redirect to dashboard if already authenticated
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (token && userRole) {
      const dashboard = ROLE_DASHBOARDS[userRole] || '/resident';
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
    return NextResponse.next();
  }

  // Protected routes: redirect to login if no token
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  if (userRole) {
    const allowedRoutes = ROLE_ROUTES[userRole] || [];
    const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!hasAccess) {
      // Redirect to user's dashboard if they try to access unauthorized route
      const dashboard = ROLE_DASHBOARDS[userRole] || '/resident';
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
