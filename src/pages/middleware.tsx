import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const hostname = req.nextUrl.hostname

  if (hostname.split('.').includes('c-panel')) {
    return NextResponse.redirect(new URL('/c-panel', req.url))
  }
}

export const config = {
  matcher: '/'
}
