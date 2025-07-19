import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                // Extend session.user type to include id
                (session.user as typeof session.user & { id: string }).id = token.sub ?? "";
            }
            return session;
        },
    },
});
