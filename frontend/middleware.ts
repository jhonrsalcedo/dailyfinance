export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/transactions/:path*',
    '/settings/:path*',
    '/reports/:path*',
    '/budget/:path*',
  ],
}