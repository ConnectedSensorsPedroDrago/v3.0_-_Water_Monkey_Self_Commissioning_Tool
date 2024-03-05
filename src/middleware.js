// Without a defined matcher, this one line applies next-auth to the entire project

export { default } from 'next-auth/middleware'

export const config = { matcher: ["/", "/home", "/comm-tool/:path*", "/organizations/:path*", "/users/:path*", "/support", "/profile/:path*", "/dashboard/:path*"] }