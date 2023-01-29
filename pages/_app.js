import { SessionProvider } from "next-auth/react";

import "../styles/globals.css";
import ThemeConfig from "../theme2";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeConfig>
        <Component {...pageProps} />
      </ThemeConfig>
    </SessionProvider>
  );
}

export default MyApp;
