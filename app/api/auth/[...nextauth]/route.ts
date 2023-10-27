import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { mongoDBService } from "@/utils/mongoDBService";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const { id: userID, name, image } = user;

        const userExists = await mongoDBService.findDocument("users", {
          userID,
        });

        if (!userExists) {
          await mongoDBService.insertDocument("users", {
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
