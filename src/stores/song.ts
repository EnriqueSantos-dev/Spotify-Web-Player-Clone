import create from "zustand";
import { Track } from "../interfaces/playlist-spotify";

interface SongState {
  currentSong: Track | null;
  setSong: (track: Track) => void;
  setTogglePlayingSong: (pause: boolean) => void;
  isPlaying: boolean;
}

const useSongStore = create<SongState>((set) => ({
  currentSong: null,
  isPlaying: false,
  setSong: (track) => set(() => ({ currentSong: track })),
  setTogglePlayingSong: (pause: boolean) => set(() => ({ isPlaying: pause })),
}));

export default useSongStore;
