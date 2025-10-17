// src/types/next-auth.d.ts

import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * On étend la session par défaut pour y inclure notre accessToken.
   */
  interface Session {
    user: {
      id: string;
      // On déplace accessToken DANS session.user, pour correspondre à notre code auth.ts
      accessToken?: string;
    } & DefaultSession["user"] // On fusionne avec les propriétés par défaut (name, email, image)
  }
}

declare module "next-auth/jwt" {
  /** On étend le token JWT pour qu'il puisse contenir l'accessToken. */
  interface JWT {
    accessToken?: string
  }
}