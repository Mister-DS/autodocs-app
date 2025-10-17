// src/middleware.ts

// On importe notre propre configuration 'auth' depuis notre fichier central.
// C'est notre nouveau "standard téléphonique".
import { auth } from "@/lib/auth"

// On exporte directement la propriété 'middleware' de notre configuration.
// C'est comme demander au standard de nous passer le service "gardien".
export const middleware = auth

// La configuration du matcher ne change pas, elle est parfaite.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/repos/:path*",
    "/docs/:path*",
    "/settings/:path*"
  ],
}