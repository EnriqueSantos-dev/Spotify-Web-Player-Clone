import { isNullOrUndefined } from "util";
import create from "zustand";
import type { Playlist } from "../interfaces/playlist-spotify";

type PlaylistState = {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  addPlaylist: (playlist: Playlist[]) => void;
  setCurrentPlaylist: (playlist: Playlist) => void;
};

const usePlaylistStore = create<PlaylistState>()((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  addPlaylist: (playlists: Playlist[]) => set(() => ({ playlists })),
  setCurrentPlaylist: (playlist: Playlist) =>
    set(() => ({ currentPlaylist: playlist })),
}));

export default usePlaylistStore;
