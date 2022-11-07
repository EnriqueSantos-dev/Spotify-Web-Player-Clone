import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import Head from "next/head";

interface Props {
  session: Session;
}

export default function Home({ session }: Props) {
  function handleLogout() {
    signOut({ redirect: true });
  }

  return (
    <div>
      <Head>
        <title>Spotify Clone</title>
      </Head>

      <main className="flex justify-center items-center h-screen w-screen bg-black">
        <div className="flex flex-col text-white">
          <h1 className="text-3xl font-semibold mb-4">
            Hello, {session?.user.name}
          </h1>

          <button
            className="bg-gray-700 text-white px-6 py-3 rounded font-semibold uppercase text-lg"
            onClick={handleLogout}
          >
            SignOut
          </button>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
