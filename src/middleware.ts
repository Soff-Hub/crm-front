import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')
  const rolesCookie = req.cookies.get('roles')
  const roles: string[] = rolesCookie ? JSON.parse(rolesCookie) : []

  const studentRole: any = roles.find((role: any) => role.name === 'STUDENT')
  const financeRole: any = roles.find((role: any) => role.name === 'CASHER')

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (studentRole && studentRole.exists) {
    return NextResponse.redirect(new URL('/student-profile', req.url))
  }

  if (financeRole && studentRole.exists) {
    return NextResponse.redirect(new URL('/finance', req.url))
  }

  return NextResponse.redirect(new URL('/dashboard', req.url))
}

export const config = {
  matcher: ['/']
}
