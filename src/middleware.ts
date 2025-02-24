import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')
  const roles = req.cookies.get('roles')

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (roles?.includes('student')) {
    return NextResponse.redirect(new URL('/student-profile', req.url))
  }
  if (roles?.includes('casher') && (!roles.includes('ceo') || !roles.includes('admin'))) {
    return NextResponse.redirect(new URL('/finance', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/']
}
