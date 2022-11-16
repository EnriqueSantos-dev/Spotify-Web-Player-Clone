import React from "react";
import { useSession } from "next-auth/react";
import useSongStore from "../stores/song";
import {
  CurrentStateTrack,
  RepeatState,
  ShuffleState,
  Track,
} from "../interfaces/playlist-spotify";
import { toast } from "react-toastify";
import useSpotifyAxios from "./useSpotifyAxios";
import { debounce } from "lodash";

function usePlayer() {
  const { data: session } = useSession();
  const axiosApi = useSpotifyAxios();
  const setSong = useSongStore((state) => state.setSong);
  const setTogglePlayingSong = useSongStore(
    (state) => state.setTogglePlayingSong
  );
  const isPlaying = useSongStore((state) => state.isPlaying);
  const currentSong = useSongStore((state) => state.currentSong);

  const fetchCurrentSong = React.useCallback(async (): Promise<void> => {
    try {
      const res = await axiosApi.get<CurrentStateTrack>("me/player");
      const songCurrentInfo = res.data;

      const resTrack = await axiosApi.get<Track>(
        `/tracks/${songCurrentInfo.item.id}`
      );
      const track = resTrack.data;

      setSong(track);
      setTogglePlayingSong(songCurrentInfo.is_playing);
    } catch (e) {
      console.log(e);
    }
  }, [axiosApi, setSong, setTogglePlayingSong]);

  async function setPlaySong(track: Track): Promise<void> {
    try {
      await axiosApi.put("me/player/play", {
        uris: [track.uri],
      });

      setTogglePlayingSong(true);
      setSong(track);
    } catch (error) {
      console.error(error);
    }
  }

  const togglePlayPause = debounce(async (): Promise<void> => {
    try {
      if (isPlaying) {
        await axiosApi.put("me/player/pause");
        setTogglePlayingSong(false);
      } else {
        await axiosApi.put("me/player/play");
        setTogglePlayingSong(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, 200);

  async function setPauseSong(): Promise<void> {
    try {
      await axiosApi.put("me/player/pause");
      setTogglePlayingSong(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function setShuffleSongs(state: boolean): Promise<void> {
    try {
      await axiosApi.put("me/player/shuffle", null, {
        params: {
          state,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function setNextSong(): Promise<void> {
    try {
      const deviceActive = await getDeviceActive();

      if (!deviceActive) {
        toast.error(
          "connect to spotify via web app or mobile app and try again!"
        );
        return;
      }

      await axiosApi.post("me/player/next");
      await fetchCurrentSong();
    } catch (e) {
      console.log(e);
    }
  }

  async function setPreviousSong(): Promise<void> {
    try {
      const deviceActive = await getDeviceActive();
      if (!deviceActive) {
        toast.error(
          "connect to spotify via web app or mobile app and try again!"
        );
        return;
      }
      await axiosApi.post("me/player/previous");
      await fetchCurrentSong();
    } catch (e) {
      console.log(e);
    }
  }
  async function setRepeat(
    typeRepeat: "track" | "context" | "off"
  ): Promise<void> {
    try {
      const deviceActive = await getDeviceActive();

      if (!deviceActive) {
        toast.error(
          "connect to spotify via web app or mobile app and try again!"
        );
        return;
      }

      await axiosApi.put("me/player/repeat", null, {
        params: {
          state: typeRepeat,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  const getDeviceActive = React.useCallback(async (): Promise<boolean> => {
    try {
      const res = await axiosApi.get("me/player/devices");
      const deviceActive = res.data.devices.some(
        (device: any) => device.is_active
      );
      return deviceActive;
    } catch (error) {
      return false;
    }
  }, [session]);

  React.useEffect(() => {
    if (!currentSong) {
      fetchCurrentSong();
    }
  }, [session]);

  return {
    fetchCurrentSong,
    setNextSong,
    setPreviousSong,
    setRepeat,
    setShuffleSongs,
    setPlaySong,
    togglePlayPause,
    setPauseSong,
    getDeviceActive,
  };
}

export default usePlayer;
