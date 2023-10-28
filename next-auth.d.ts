import NextAuth, { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    expires: string;
    user: {
      image: string;
      name: string;
      userID: string;
    };
  }
}
