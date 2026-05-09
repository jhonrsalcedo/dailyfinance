export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/transactions/:path*',
    '/reports/:path*',
    '/budget/:path*',
    '/settings/:path*',
  ],
}