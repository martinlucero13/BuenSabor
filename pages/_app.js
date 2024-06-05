import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';

import { UtilityContextPorvider } from '../src/Context/utilityContext';
import { PedidoContextPorvider } from '../src/Context/pedidoContext';
import { UserContextProvider } from '../src/context/userContext';

import Header from '../src/components/Header/Header';

import { SessionProvider } from "next-auth/react";

export default function MyApp({ Component, pageProps }) {

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/bs.png" />
        <title>BUEN SABOR</title>
      </Head>
      <SessionProvider session={pageProps.session}>
        <UserContextProvider>
          <PedidoContextPorvider>
            <UtilityContextPorvider>
              <Header />
              <Component {...pageProps} />
            </UtilityContextPorvider>
          </PedidoContextPorvider>
        </UserContextProvider>
      </SessionProvider>
    </>
  );
}
