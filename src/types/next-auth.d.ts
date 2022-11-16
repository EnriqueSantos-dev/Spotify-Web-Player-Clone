import { JWT } from "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    accessTokenExpiresAt: number;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth" {
  interface DefaultSession {
    accessToken: string;
    refreshToken: string;
    error: string;
  }

  interface Session {
    user: {
      username: string;
    } & DefaultSession["user"];
  }
}
