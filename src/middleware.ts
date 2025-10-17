import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Routes publiques (accessibles sans connexion)
  const publicRoutes = ["/", "/login", "/api/auth"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Routes protégées (nécessitent une connexion)
  const protectedRoutes = ["/dashboard", "/repos", "/docs", "/settings"]
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Si on essaie d'accéder à une route protégée sans être connecté
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Si on est connecté et qu'on essaie d'accéder à /login
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

// Configuration du middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
}