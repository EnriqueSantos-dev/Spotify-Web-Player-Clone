import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import SpotifyProvider from "next-auth/providers/spotify";

type ResponseRefreshToken =
  | SuccessRefreshTokenResponse
  | ErrorRefreshTokenResponse;

type SuccessRefreshTokenResponse = JWT;

type ErrorRefreshTokenResponse = JWT & {
  error: string;
};

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-follow-read",
  "user-library-modify",
  "playlist-modify-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-library-read",
  "streaming",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
  "user-follow-read",
].join(",");

const params = {
  scope: scopes,
};

const queryStringParams = new URLSearchParams(params);

const LOGIN_URL =
  "https://accounts.spotify.com/authorize?" + queryStringParams.toString();

async function generateRefreshToken(token: JWT): Promise<ResponseRefreshToken> {
  try {
    const url =
      "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID as string,
        client_secret: process.env.SPOTIFY_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await axios.post(url, null, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const refreshToken = response.data.access_token;

    if (!(response.status === 200)) {
      throw new Error("RefreshAccessTokenError");
    }

    return {
      ...token,
      accessToken: refreshToken,
      accessTokenExpiresAt: Date.now() * response.data.expires_in * 1000, // = 1 hour as 3600 returns from spotify Api
      refreshToken: refreshToken ?? token.refreshToken,
    };
  } catch (err) {
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
          accessToken: account.access_token!,
          refreshToken: account.refresh_token!,
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
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error as string;
      session.user.username = token.username as string;

      return session;
    },
  },
};

export default NextAuth(authOptions);
