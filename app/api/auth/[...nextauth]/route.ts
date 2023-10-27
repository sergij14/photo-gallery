import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        const userID = token.sub;

        return {
          ...session,
          user: {
            ...session.user,
            userID,
          },
        };
      } catch (err) {
        console.log(err);
        return session;
      }
    },
  },
});

export { handler as GET, handler as POST };
