import { ApolloProvider } from '@apollo/client/react';
import { client } from '../src/services/apollo';
import './globals.css';

import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}