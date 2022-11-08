import { GetServerSideProps, NextPage } from "next";
import { getSession, signIn } from "next-auth/react";
import Logo from "../../components/Logo";

const LoginPage: NextPage = () => {
  async function handleLogin() {
    await signIn("spotify", { callbackUrl: "/" });
  }

  return (
    <div>
      <main className="flex flex-col justify-center gap-8 items-center h-screen w-screen bg-black">
        <Logo className="fill-green-600 w-[88px] h-[88px]" />

        <h1 className="font-bold text-4xl text-white">Spotify Clone</h1>

        <button
          className="bg-green-600 flex justify-center items-center gap-2 text-white text-lg font-semibold capitalize rounded px-6 py-3 hover:brightness-75 transition-all"
          onClick={handleLogin}
        >
          <Logo className="fill-white w-6 h-6" />
          sign in with spotify
        </button>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: "/",
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

export default LoginPage;
