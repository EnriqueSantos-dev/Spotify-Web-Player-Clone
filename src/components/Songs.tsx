import React from "react";
import useSpotifyAxios from "../hooks/useSpotifyAxios";
import { Track } from "../interfaces/playlist-spotify";
import usePlaylistStore from "../stores/playlist-store";
import Song from "./Song";

const Songs: React.FC = () => {
  const axiosApi = useSpotifyAxios();
  const playlist = React.useRef(usePlaylistStore.getState().currentPlaylist);

  const [tracks, setTracks] = React.useState<Track[]>([]);

  async function getPlaylists() {
    try {
      if (playlist?.current?.id) {
        const songs = await axiosApi.get(
          `playlists/${playlist?.current?.id}/tracks`
        );
        const tracks = songs.data.items.map((tracks: any) => tracks.track);
        setTracks(tracks as Track[]);
      }
    } catch (e) {}
  }

  React.useEffect(() => {
    getPlaylists();
  }, [playlist.current]);

  React.useEffect(
    () =>
      usePlaylistStore.subscribe(
        (state) => (playlist.current = state.currentPlaylist)
      ),
    []
  );

  return (
    <div className="flex flex-col space-y-2 p-6 md:p-8 max-h-screenMax overflow-y-auto scrollbar-hide scroll-smooth">
      {tracks?.map((track, index) => (
        <Song key={track?.id} order={index} track={track} />
      ))}
    </div>
  );
};

export default Songs;
