import React from "react";
import Link from "next/link";
import {
  BuildingLibraryIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  HeartIcon,
  WifiIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import usePlaylistStore from "../stores/playlist-store";
import useMenuStore from "../stores/menu";
import { Playlist } from "../interfaces/playlist-spotify";
import { useSession } from "next-auth/react";
import useSpotifyAxios from "../hooks/useSpotifyAxios";

function SideBar() {
  const axiosApi = useSpotifyAxios();
  const { data: session } = useSession();
  const { open, setOpen } = useMenuStore((state) => state);
  const { addPlaylist, currentPlaylist, playlists, setCurrentPlaylist } =
    usePlaylistStore((state) => state);

  function handleSelectPlaylist(playlist: Playlist) {
    setCurrentPlaylist(playlist);
    setOpen(false);
  }

  function getRandomPlaylistToInit(playlists: Playlist[]) {
    return playlists[Math.floor(Math.random() * playlists.length - 1)];
  }

  function getPlaylists() {
    axiosApi
      .get("/me/playlists")
      .then((response) => {
        addPlaylist(response.data.items as Playlist[]);
        setCurrentPlaylist(
          getRandomPlaylistToInit(response.data.items as Playlist[])
        );
      })
      .catch((err) => console.error(err));
  }

  React.useEffect(() => {
    if (playlists.length === 0) {
      getPlaylists();
    }
  }, [session]);

  return (
    <>
      <div
        className={clsx(
          "absolute top-0 left-0 -z-0 bg-overlay w-screen h-screen lg:hidden",
          {
            hidden: !open,
            block: open,
            "md:block": open,
          }
        )}
      />
      <aside
        className={clsx(
          "fixed z-10 top-0 max-h-[calc(100vh_-_96px)] h-full  lg:relative lg:visible  bg-black pt-6 w-full sm:max-w-[250px]  border-r lg:left-0 border-zinc-800 transition-all duration-300 ease-linear",
          {
            invisible: !open,
            visible: open,
            "-left-full": !open,
            "left-0": open,
          }
        )}
      >
        <nav className="flex flex-col px-6 h-full">
          <div className="max-h-[50vh]">
            <div className="lg:hidden flex w-full justify-end items-center">
              <button className="grid col-span-1 place-content-center bg-black lg:hidden w-7 h-7 shadow-xl shadow-black rounded-full px-2 text-zinc-500 border-2 border-zinc-700 hover:opacity-90">
                <XMarkIcon className="w-5 h-5" onClick={() => setOpen(false)} />
              </button>
            </div>

            <div className="flex flex-col justify-between text-gray-500 transition-colors text-sm">
              <div className="flex- flex-col border-b pb-3 border-zinc-800">
                <Link href="/" className="flex items-center gap-4 group h-10">
                  <HomeIcon
                    className="w-5 h-5 group-hover:color-white"
                    color="#b3b3b3"
                  />
                  <span className="font-semibold capitalize group-hover:text-white text-sm">
                    Home
                  </span>
                </Link>

                <Link
                  href="/search"
                  className="flex items-center gap-4 group h-10"
                >
                  <MagnifyingGlassIcon
                    className="w-5 h-5 group-hover:color-white"
                    color="#b3b3b3"
                  />
                  <span className="font-semibold capitalize group-hover:text-white text-sm">
                    search
                  </span>
                </Link>

                <Link
                  href="/collection"
                  className="flex items-center gap-4 group h-10"
                >
                  <BuildingLibraryIcon
                    className="w-5 h-5 group-hover:color-white"
                    color="#b3b3b3"
                  />
                  <span className="font-semibold capitalize group-hover:text-white text-sm">
                    your library
                  </span>
                </Link>
              </div>

              <div className="flex flex-col mt-6 pb-4 space-y-4 border-b border-zinc-800">
                <button className="flex items-center space-x-3 group text-gray-500 ">
                  <span className="group-hover:text-white flex text-gray-500 ">
                    <PlusCircleIcon className="h-5 w-5" />
                  </span>
                  <p className="group-hover:text-white">Create Playlist</p>
                </button>

                <button className="flex items-center space-x-3 group text-gray-500 ">
                  <span className="group-hover:text-white text-gray-500">
                    <HeartIcon className="h-5 w-5" />
                  </span>
                  <p className="group-hover:text-white">Liked Songs</p>
                </button>

                <button className="flex items-center space-x-3 group text-gray-500 ">
                  <span className="group-hover:text-white flex text-gray-500 ">
                    <WifiIcon className="h-5 w-5 rotate-45" />
                  </span>
                  <p className="group-hover:text-white">your episodes</p>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto scroll-smooth flex-grow scrollbar scrollbar-hide  my-3 text-sm">
            <div className="flex flex-col space-y-4 w-full">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  className={clsx(
                    "first-letter:capitalize  hover:text-white overflow-ellipsis whitespace-nowrap max-w-[200px] overflow-hidden  outline-none text-left border-0",
                    {
                      "text-white": playlist.id === currentPlaylist?.id,
                      "text-gray-500": playlist.id !== currentPlaylist?.id,
                    }
                  )}
                  onClick={() => handleSelectPlaylist(playlist)}
                >
                  {playlist.name}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default SideBar;
