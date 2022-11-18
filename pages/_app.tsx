import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.scss';
import '../styles/heart.css';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
