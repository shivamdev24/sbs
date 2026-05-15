import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './lib/token';
import { cookies } from 'next/headers';

const PUBLIC_PATHS = ['/login', '/signup', '/reset-password'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public routes
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }


  // 2. Get tokens from cookies
  const accessToken = req.cookies.get("accesstoken")?.value;
const refreshToken = req.cookies.get("refreshtoken")?.value;

  console.log('Access Token in proxy:', accessToken);
  console.log('Refresh Token in proxy:', refreshToken);
  // 3. If no tokens, redirect
  if (!accessToken || !refreshToken) {
    console.log('No tokens, redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 4. Verify tokens
  try {
   const decodedAccessToken = verifyAccessToken(accessToken);
    console.log('Access token valid:', decodedAccessToken);

    return NextResponse.next();
  } catch {
    // try {
    //   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    //   return NextResponse.next();
    // } catch {
    //   console.log('Invalid tokens, redirecting to login');
    //   return NextResponse.redirect(new URL('/login', req.url));
    // }

      console.log('Invalid tokens, redirecting to login');
      return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'], // must match protected routes
};