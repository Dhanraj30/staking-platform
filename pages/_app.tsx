import '../styles/globals.css';

import { connectWallet } from '../components/config';
import { useState, useEffect } from "react";
import { AppProps } from 'next/app';  // TypeScript AppProps type
import { Button } from "@/components/ui/button";  // ShadCN button component

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    
      <Component {...pageProps} />
    
  );
}

export default MyApp;
