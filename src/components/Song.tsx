import React from "react";
import Image from "next/image";
import { Track } from "../interfaces/playlist-spotify";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import useSongStore from "../stores/song";
import clsx from "clsx";
import usePlayer from "../hooks/usePlayer";

interface Props {
  order: number;
  track: Track;
}

const Song: React.FC<Props> = ({ order, track }) => {
  const { isPlaying, currentSong } = useSongStore();
  const { setPlaySong, togglePlayPause } = usePlayer();

  function handlePlay() {
    if (!isPlaying && currentSong?.id !== track?.id) {
      setPlaySong(track);
    } else {
      togglePlayPause();
    }
  }

  return (
    <div
      className={clsx(
        "grid grid-cols-3 md:grid-cols-3 w-full p-4 rounded-lg text-gray-500 transition-colors group",
        {
          "bg-gray-900": currentSong?.id === track?.id,
          "hover:bg-gray-800": currentSong?.id === track?.id,
          "hover:bg-gray-900": currentSong?.id !== track?.id,
        }
      )}
    >
      <div className="flex space-x-5 items-center col-start-1 col-end-3 md:col-start-auto md:col-end-auto">
        {currentSong?.id === track?.id ? (
          isPlaying ? (
            <button
              className="transition-colors block group-hover:m-0"
              onClick={handlePlay}
            >
              <PauseIcon className="w-4 h-4 stroke-2 hover:text-white" />
            </button>
          ) : (
            <button
              className="transition-colors block group-hover:m-0"
              onClick={handlePlay}
            >
              <PlayIcon className="w-4 h-4 hover:text-white" />
            </button>
          )
        ) : (
          <>
            <span className="group-hover:hidden w-4">{order + 1}</span>
            <button
              className="transition-colors hidden group-hover:block group-hover:m-0"
              onClick={() => setPlaySong(track)}
            >
              <PlayIcon className="w-4 h-4 hover:text-white" />
            </button>
          </>
        )}
        <div className="relative min-w-[48px] min-h-[48px] pointer-events-none">
          <Image
            src={track?.album?.images?.[0]?.url as string}
            alt="photo album"
            fill
          />
        </div>
        <div className="flex flex-col self-end md:col-span-1 md:whitespace-normal overflow-hidden overflow-ellipsis pointer-events-none">
          <p className="overflow-ellipsis overflow-hidden text-white whitespace-nowrap">
            {track?.name}
          </p>
          <p className="text-xs overflow-ellipsis overflow-hidden">
            {track?.artists?.[0]?.name}
          </p>
        </div>
      </div>

      <div className="items-center hidden md:flex md:justify-center lg:justify-start pointer-events-none">
        <p className="overflow-hidden whitespace-nowrap overflow-ellipsis">
          {track?.album?.name}
        </p>
      </div>

      <span className="flex items-center justify-self-end span col-auto md:col-span-1">
        {new Date(track?.duration_ms).getMinutes().toString().padStart(2, "0")}:
        {new Date(track?.duration_ms).getSeconds().toString().padStart(2, "0")}
      </span>
    </div>
  );
};

export default Song;
