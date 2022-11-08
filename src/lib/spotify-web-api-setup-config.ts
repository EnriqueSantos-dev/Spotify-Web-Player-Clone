import SpotifyWebApi from "spotify-web-api-node";

export const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-follow-read",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-library-read",
  "streaming",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-follow-read",
].join(",");

const params = {
  scope: scopes,
};

const queryStringParams = new URLSearchParams(params);

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID as string,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
});

const LOGIN_URL =
  "https://accounts.spotify.com/authorize?" + queryStringParams.toString();

export { LOGIN_URL };
export default spotifyApi;
