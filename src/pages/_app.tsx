import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps as NextAppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "../../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

interface AppProps extends NextAppProps {
  session: Session;
}

export default function App({ Component, pageProps, session }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ToastContainer limit={1} />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
