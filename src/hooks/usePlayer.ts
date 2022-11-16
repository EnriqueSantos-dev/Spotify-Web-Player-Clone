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

type ReturnfetchCurrentSong = {
  volumeCurrent: number | null;
  isRepeatSongActive: RepeatState;
  isShuffle: ShuffleState;
  progress_ms: number | null;
  error: string | null;
  item: Track | null;
};

function usePlayer() {
  const { data: session } = useSession();
  const axiosApi = useSpotifyAxios();
  const setSong = useSongStore((state) => state.setSong);
  const setTogglePlayingSong = useSongStore(
    (state) => state.setTogglePlayingSong
  );
  const isPlaying = useSongStore((state) => state.isPlaying);
  const currentSong = useSongStore((state) => state.currentSong);

  //@ts-ignore
  const fetchCurrentSong =
    React.useCallback(async (): Promise<ReturnfetchCurrentSong> => {
      try {
        const res = await axiosApi.get<CurrentStateTrack>("me/player");
        const songCurrentInfo = res.data;

        const resTrack = await axiosApi.get<Track>(
          `/tracks/${songCurrentInfo.item.id}`
        );
        const track = resTrack.data;

        setSong(track);
        setTogglePlayingSong(songCurrentInfo.is_playing);

        return {
          volumeCurrent: songCurrentInfo.device.volume_percent,
          isRepeatSongActive: songCurrentInfo.repeat_state,
          error: null,
          isShuffle: songCurrentInfo.shuffle_state,
          progress_ms: songCurrentInfo.progress_ms,
          item: songCurrentInfo.item as unknown as Track,
        };
      } catch (e) {
        return {
          volumeCurrent: null,
          isRepeatSongActive: "off",
          error: "Error fetchCurrentSong",
          isShuffle: "off",
          progress_ms: null,
          item: null,
        };
      }
    }, [axiosApi, setSong, setTogglePlayingSong]);

  async function setPlaySong(track: Track) {
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

  const togglePlayPause = debounce(async () => {
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

  async function setPauseSong() {
    try {
      await axiosApi.put("me/player/pause");
      setTogglePlayingSong(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function setShuffleSongs(state: boolean) {
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

  async function setNextSong() {
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
      return {
        error: "Error set next song",
      };
    }
  }

  async function setPreviousSong() {
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
      return {
        error: "Error set previous Song",
      };
    }
  }
  async function setRepeat(typeRepeat: "track" | "context" | "off") {
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
    } catch (error) {
      return {
        error: "Error on set repeat song",
      };
    }
  }

  const getDeviceActive = React.useCallback(async () => {
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
