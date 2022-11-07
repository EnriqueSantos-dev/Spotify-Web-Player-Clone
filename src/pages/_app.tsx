import "../../styles/globals.css";
import type { AppProps as NextAppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface AppProps extends NextAppProps {
  session: Session;
}

export default function App({ Component, pageProps, session }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
