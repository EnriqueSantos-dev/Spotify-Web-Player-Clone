import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import {
  Bars3Icon,
  ChevronDownIcon,
  MusicalNoteIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import useMenuStore from "../stores/menu";
import Songs from "./Songs";
import usePlaylistStore from "../stores/playlist-store";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-yellow-500",
  "from-red-500",
  "from-pink-500",
  "from-purple-500",
];

interface Props {
  userSession: Session;
}

const Center: React.FC<Props> = ({ userSession }) => {
  const [color, setColor] = React.useState("from-green-500");
  const setOpen = useMenuStore((state) => state.setOpen);
  const currentPlaylist = usePlaylistStore((state) => state.currentPlaylist);

  React.useEffect(() => {
    setColor(colors.splice(Math.floor(Math.random() * colors.length), 1)[0]);
  }, [currentPlaylist]);

  return (
    <div className="flex-1">
      <header className="absolute w-full px-6 md:px-8 top-5 text-white flex items-center justify-between lg:justify-self-auto h-fit lg:right-8 lg:w-auto">
        <button className="grid col-span-1 place-content-center bg-black lg:hidden w-8 h-8 shadow-xl shadow-black rounded-full px-4 text-gray-500 hover:opacity-90 transition-opacity">
          <Bars3Icon className="w-5 h-5" onClick={() => setOpen(true)} />
        </button>
        <ProfilePopup
          username={userSession.user.name}
          userAvatarUrl={userSession.user.image}
        />
      </header>

      <section
        className={`flex justify-end items-end gap-7 h-fit pt-20 p-6 md:p-8 md:pt-20 w-full overflow-y-auto scrollbar-hide  bg-gradient-to-b ${color} to-black`}
      >
        <div className="relative flex items-stretch min-w-[150px] min-h-[150px] lg:w-60 lg:h-60 shadow-xl shadow-black">
          {currentPlaylist?.images[0]?.url ? (
            <Image
              src={currentPlaylist?.images[0].url}
              alt=""
              fill
              priority
              sizes="800"
            />
          ) : (
            <div className="flex justify-center items-center w-full bg-zinc-700">
              <MusicalNoteIcon className="w-12 h-12 text-zinc-500" />
            </div>
          )}
        </div>

        <div className="flex h-full justify-end flex-1 flex-col space-y-3 pt-5 text-white">
          <span className="text-xs text-white font-semibold md:text-sm lg:text-base uppercase">
            Playlist
          </span>
          <h2 className="text-white text-2xl font-bold md:text-3xl xl:text-5xl">
            {currentPlaylist?.name}
          </h2>
        </div>
      </section>

      <Songs />
    </div>
  );
};

interface PropsProfile {
  username?: string | null | undefined;
  userAvatarUrl?: string | null | undefined;
}

const ProfilePopup: React.FC<PropsProfile> = ({ username, userAvatarUrl }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      className="relative flex items-center space-x-3 p-1 pr-2 bg-black text-white text-sm font-bold opacity-95 hover:opacity-90 rounded-full cursor-pointer transition-all"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-center items-center relative w-10 h-10 rounded-full overflow-hidden">
        {userAvatarUrl ? (
          <Image src={userAvatarUrl} alt="avatar" fill quality={100} />
        ) : (
          <UserIcon className="h-5 w-5" />
        )}
      </div>

      <span>{username ?? "User"}</span>

      <ChevronDownIcon className="h-4 w-4" />

      <div
        className={clsx(
          "absolute top-full z-10 mt-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-black rounded-lg",
          {
            visible: isOpen,
            invisible: !isOpen,
            "opacity-0": !isOpen,
            "opacity-100": isOpen,
          }
        )}
      >
        <button
          className="capitalize text-sm font-semibold text-white"
          onClick={() => signOut()}
        >
          Log out
        </button>
      </div>
    </div>
  );
};
export default Center;
