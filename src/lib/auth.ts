// src/lib/auth.ts

import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // --- LA CORRECTION EST ICI ---
    // Le "callbacks" nous permet de contrôler ce qui est dans la session.

    async jwt({ token, account }) {
      // Quand l'utilisateur se connecte, l'objet `account` contient l'accessToken de GitHub.
      // On le sauvegarde dans le `token` JWT.
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    
    async session({ session, token }) {
      // À chaque fois qu'une session est lue, on prend l'accessToken
      // depuis le `token` JWT et on le met dans l'objet `session.user`.
      if (token.accessToken && session.user) {
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
})