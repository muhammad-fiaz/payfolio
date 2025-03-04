import NextAuth, { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt"; // ✅ Import JWT type
import GithubProvider from "next-auth/providers/github";
import type { NextApiRequest, NextApiResponse } from "next";

// Extend the User type to include `id`
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub ?? ""; // ✅ Now TypeScript recognizes `id`
      }
      return session;
    },
  },
};

const handler = (req: NextApiRequest, res: NextApiResponse) =>
    NextAuth(req, res, authOptions);

export default handler;
