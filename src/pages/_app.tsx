import { AuthGuard } from "@/components/AuthGuard";
import theme from "styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { GoogleAnalytics } from "nextjs-google-analytics";
import "styles/pagination.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <GoogleAnalytics trackPageViews />
      <SessionProvider session={pageProps.session}>
        <ChakraProvider theme={theme}>
          <AuthGuard>
            <Component {...pageProps} />
          </AuthGuard>
        </ChakraProvider>
      </SessionProvider>
    </>
  );
};

export default App;
