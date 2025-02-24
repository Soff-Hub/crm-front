import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')
  const roles = req.cookies.get('roles')

  const host = req.headers.get('host') || ''
  const subdomain = host.split('.')[0]

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (subdomain === 'c-panel' && roles) {
    return NextResponse.redirect(new URL('/c-panel', req.url))
  }

  if (roles?.includes('student')) {
    return NextResponse.redirect(new URL('/student-profile', req.url))
  }

  if (roles?.includes('casher') && !roles.includes('ceo') && !roles.includes('admin')) {
    return NextResponse.redirect(new URL('/finance', req.url))
  }

  return NextResponse.redirect(new URL('/dashboard', req.url))
}

export const config = {
  matcher: ['/']
}
