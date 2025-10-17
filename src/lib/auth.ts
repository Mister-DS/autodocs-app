import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { db } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email repo',
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.id = profile.id
        
        // Créer ou mettre à jour l'utilisateur dans la DB
        try {
          await db.user.upsert({
            where: { id: String(profile.id) },
            update: {
              name: profile.name || null,
              email: profile.email || null,
              image: profile.avatar_url || null,
            },
            create: {
              id: String(profile.id),
              name: profile.name || null,
              email: profile.email || null,
              image: profile.avatar_url || null,
            }
          })
        } catch (error) {
          console.error("Erreur création utilisateur:", error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id)
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
})