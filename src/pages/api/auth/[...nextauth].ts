import type { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, {
  LOGIN_URL,
} from "../../../lib/spotify-web-api-setup-config";

type ResponseRefreshToken =
  | SuccessRefreshTokenResponse
  | ErrorRefreshTokenResponse;

type SuccessRefreshTokenResponse = JWT;

type ErrorRefreshTokenResponse = JWT & {
  error: string;
};

async function generateRefreshToken(token: JWT): Promise<ResponseRefreshToken> {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshAccessToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshAccessToken.access_token,
      accessTokenExpiresAt: Date.now() * refreshAccessToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify Api
      refreshToken: refreshAccessToken.refresh_token ?? token.refreshToken,
    };
  } catch (err) {
    console.log(err);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET as string,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // return new infos if token and account exists in login process
      if (token && account) {
        return {
          ...token,
          access_token: account.accessToken,
          refresh_token: account.refreshToken,
          username: account.providerAccountId,
          accessTokenExpiresAt: account.expires_at! * 1000, // convert to ms
        };
      }

      // return previous token if this not expired
      if (Date.now() < token.accessTokenExpiresAt) {
        return token;
      }

      //generate refreshToken
      return await generateRefreshToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.access_token as string;
      session.error = token.error as string;
      session.user.username = token.username as string;

      return session;
    },
  },
};

export default NextAuth(authOptions);
