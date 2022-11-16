import React from "react";
import { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Center from "../components/Center";
import Player from "../components/Player";
import SideBar from "../components/SideBar";
import useSongStore from "../stores/song";
import useSpotifyAxios from "../hooks/useSpotifyAxios";
import { Device } from "../interfaces/playlist-spotify";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface HomeProps {
  session: Session;
}

const HomePage: NextPage<HomeProps> = ({ session }) => {
  const axiosApi = useSpotifyAxios();
  const currentSong = useSongStore((state) => state.currentSong);

  async function getDeviceActive() {
    try {
      const res = await axiosApi.get<{ devices: Device[] }>(
        "me/player/devices"
      );
      const data = res.data?.devices;
      const deviceActive = data?.some((device) => device.is_active);

      if (!deviceActive) {
        toast.error("Connect your device in app spotify.");
      }
    } catch (error: any) {
      if (error instanceof AxiosError || error.reason === "NO_ACTIVE_DEVICE") {
        toast.error("Connect your device in app spotify.");
      }
    }
  }

  React.useEffect(() => {
    getDeviceActive();
  }, [session]);

  return (
    <div>
      <Head>
        <link rel="icon" type="image/svg+xml" href="assets/favicon.svg" />
        <link rel="icon" type="image/png" href="assets/favicon.png" />
        <title>{currentSong?.name ?? "Spotify - Web Player Clone"}</title>
      </Head>

      <main className="flex flex-col bg-black h-screen w-full overflow-hidden">
        <div className="flex max-h-[calc(100vh_-_96px)] h-full">
          <SideBar />
          <Center userSession={session} />
        </div>
        <div className="stick bottom-0 min-h-[96px] z-10">
          <Player />
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};

export default HomePage;
