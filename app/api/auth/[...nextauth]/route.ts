import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { mongoDBService } from "@/utils/mongoDBService";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      try {
        return {
          ...session,
          user: {
            ...session.user,
            userID: token.sub,
          },
        };
      } catch (err) {
        console.log(err);
        return session;
      }
    },
    async signIn({ user }) {
      try {
        const { id: userID, name, image } = user;

        const mongoDbClient = await mongoDBService.connect();

        const userExists = await mongoDbClient.findDocument("users", {
          userID,
        });

        if (!userExists) {
          await mongoDbClient.insertDocument("users", {
            userID,
            name,
            image,
          });
        }

        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
