import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getValidSubdomain } from './@core/utils/getValidSubdomain'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')
  const rolesCookie = req.cookies.get('roles')
  const roles: { id: number; name: string; exists: boolean }[] = rolesCookie ? JSON.parse(rolesCookie) : []

  const url = req.nextUrl.clone()

  if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes('_next')) return

  const studentRole = roles.find(role => role.name === 'STUDENT' && role.exists)
  const financeRole = roles.find(role => role.name === 'CASHER' && role.exists)
  const dashboardRole = roles.some(role => ['ADMIN', 'TEACHER', 'CEO'].includes(role.name) && role.exists)

  const host = req.headers.get('host')
  const subdomain = getValidSubdomain(host)

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (dashboardRole) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (studentRole) {
    return NextResponse.redirect(new URL('/student-profile', req.url))
  }

  if (financeRole) {
    return NextResponse.redirect(new URL('/finance', req.url))
  }

  if (subdomain === 'c-panel') {
    return NextResponse.redirect(new URL('/c-panel', req.url))
  }

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/']
}
