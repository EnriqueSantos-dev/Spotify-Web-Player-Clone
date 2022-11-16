import React from "react";
import { signIn, useSession } from "next-auth/react";
import axios, { Axios, AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SPOTIFY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function useSpotifyAxios() {
  const { data: session } = useSession();

  React.useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn("spotify");
      return;
    }

    if (session?.accessToken) {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${session?.accessToken}`;
    }
  }, [session]);

  return api;
}

export default useSpotifyAxios;
