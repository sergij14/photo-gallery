import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { connectToDB } from "@/utils/connectDB";

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
        const mongoClient = await connectToDB();

        const { id: userID, name, image } = user;

        const userExists = await mongoClient
          ?.db()
          .collection("users")
          .findOne({ userID });

        if (!userExists) {
          await mongoClient?.db().collection("users").insertOne({
            userID,
            name,
            image
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
