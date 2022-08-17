import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
// import EmailProvider from "next-auth/providers/email"

const prisma = new PrismaClient()

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  session: {
      strategy: "jwt",
  },
  jwt: {
      secret: 'helloshajibadminhere'
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.userRole = "admin"
        token.accessToken = account?.access_token
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // if(session){
      //   session.accessToken = token?.accessToken
      //   session.user.id = token?.id
      //   return session
      // }
      return session
    },
  }
}

export default NextAuth(authOptions)
