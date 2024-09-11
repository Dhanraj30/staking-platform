import '../styles/globals.css';

import { AppProps } from 'next/app';  // TypeScript AppProps type


function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    
      <Component {...pageProps} />
    
  );
}

export default MyApp;
