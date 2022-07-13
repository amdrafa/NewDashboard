import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../styles/theme";
import { SidebarDrawerProvider } from "../contexts/SidebarDrawerContext";
import "./calendar.css";
import { LoginContextProvider } from "../contexts/LoginContext";
import { SessionProvider as NextAuthProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'
import { CalendarContextProvider } from "../contexts/CalendarContext";

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextAuthProvider session={pageProps.session}>
        
        <LoginContextProvider>
        <CalendarContextProvider>
          <ChakraProvider theme={theme}>
            <SidebarDrawerProvider>
              <Component {...pageProps} />
            </SidebarDrawerProvider>
          </ChakraProvider>
          </CalendarContextProvider>
        </LoginContextProvider>
       
      </NextAuthProvider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default MyApp;
