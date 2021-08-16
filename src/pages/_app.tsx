import React from 'react';
import Head from 'next/head';
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import theme from '../theme';
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Make! NFT on Flow</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: false,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
