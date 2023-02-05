import AuthGuard from "@/components/AuthGuard";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import React from "react";

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider>
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default App;
