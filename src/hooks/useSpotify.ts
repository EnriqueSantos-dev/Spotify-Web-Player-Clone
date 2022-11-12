import { signIn, useSession } from "next-auth/react";
import React from "react";
import spotifyApi from "../lib/spotify-web-api-setup-config";

function useSpotify() {
  const { data: session } = useSession();

  React.useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") signIn("spotify");

    spotifyApi.setAccessToken(session?.accessToken!);
  }, [session]);

  return spotifyApi;
}

export default useSpotify;
