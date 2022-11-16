import React from "react";
import Image from "next/image";

import LikeButton from "./LikeButton";
import {
  ArrowsRightLeftIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  BackwardIcon,
  ForwardIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";
import usePlayer from "../hooks/usePlayer";
import useSongStore from "../stores/song";
import { debounce } from "lodash";
import useSpotifyAxios from "../hooks/useSpotifyAxios";

const Player: React.FC = () => {
  const axiosApi = useSpotifyAxios();
  const { isPlaying, currentSong } = useSongStore();
  const [isShuffle, setIsShuffle] = React.useState(false);
  const [isRepeatSong, setIsRepeatSong] = React.useState<
    "track" | "context" | "off"
  >("off");
  const [volume, setVolume] = React.useState(50);

  const {
    setNextSong,
    setPreviousSong,
    setRepeat,
    setShuffleSongs,
    togglePlayPause,
  } = usePlayer();

  async function handleSetShuffle() {
    setIsShuffle((state) => !state);
    await setShuffleSongs(!isShuffle);
  }

  const debounceAdjustVolume = debounce((volume: number) => {
    if (volume) {
      axiosApi
        .put("me/player/volume", null, { params: { volume_percent: volume } })
        .then((response: any) => {
          if (response.statusCode >= 200 && response.statusCode <= 299) {
            return response;
          } else {
            if (response.statusCode === 404) {
              throw Error(
                "connect to spotify via web app or mobile app and try again!"
              );
            }
          }
        })
        .catch((err: Error) => err.message);
    }
  }, 500);

  async function handleRepeatSong() {
    try {
      let stateToFetch: "track" | "context" | "off" = "off";
      setIsRepeatSong((state) => {
        if (state === "off") {
          stateToFetch = "track";
          return "track";
        }

        if (state === "track") {
          stateToFetch = "context";
          return "context";
        }

        if (state === "context") {
          stateToFetch = "off";
          return "off";
        }
        return state;
      });
      await setRepeat(stateToFetch);
    } catch (err) {}
  }

  React.useEffect(() => {
    debounceAdjustVolume(volume);
  }, [volume]);

  return (
    <div
      className={`grid grid-cols-3 py-3 px-4 md:px-8 text-white h-full bg-gradient-to-t from-gray-900 to-black`}
    >
      {/*Left side*/}
      <div className="block my-auto w-fit md:w-auto md:flex  gap-3 items-center">
        {currentSong && (
          <>
            <div className="hidden md:inline relative w-10 h-10">
              <Image
                src={currentSong?.album.images[2].url as string}
                fill
                alt="photo album"
              />
            </div>

            <div className="text-white overflow-hidden overflow-ellipsis">
              <p className="text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
                {currentSong?.name}
              </p>
              <p className="text-xs whitespace-nowrap text-gray-500 overflow-hidden overflow-ellipsis">
                {currentSong?.artists[0]?.name}
              </p>
            </div>
            <LikeButton trackIds={[currentSong?.id!]} />
          </>
        )}
      </div>
      {/*Right side*/}
      <div className="col-span-full md:col-span-1 flex justify-evenly items-center ">
        <ArrowsRightLeftIcon
          className="buttonPlayer"
          onClick={() => handleSetShuffle()}
          color={isShuffle ? "green" : "white"}
        />
        <BackwardIcon
          className="buttonPlayer"
          onClick={() => setPreviousSong()}
        />

        <div className="w-10 h-10">
          {isPlaying ? (
            <PauseCircleIcon
              className="w-full h-full cursor-pointer transition-transform duration-100 ease-out hover:scale-125"
              onClick={togglePlayPause}
            />
          ) : (
            <PlayCircleIcon
              className="w-full h-full cursor-pointer transition-transform duration-100 ease-out hover:scale-125"
              onClick={togglePlayPause}
            />
          )}
        </div>

        <ForwardIcon className="buttonPlayer" onClick={() => setNextSong()} />
        <ArrowPathIcon
          className="buttonPlayer"
          onClick={() => handleRepeatSong()}
          color={isRepeatSong !== "off" ? "green" : "white"}
        />
      </div>

      {/* volume */}
      <div className="flex col-start-2 col-end-4 row-start-1 md:col-start-auto md:col-end-auto md:row-start-auto justify-end items-center space-x-3 md:space-x-4 md:pr-5">
        <SpeakerXMarkIcon
          className="buttonPlayer"
          onClick={() => volume > 0 && setVolume((state) => state - 10)}
        />
        <input
          type="range"
          value={volume}
          min={0}
          max={100}
          className="w-20 md:w-28"
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <SpeakerWaveIcon
          className="buttonPlayer"
          onClick={() => volume < 100 && setVolume((state) => state + 10)}
        />
      </div>
    </div>
  );
};

export default Player;
