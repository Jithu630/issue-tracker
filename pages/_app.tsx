// pages/_app.tsx
    import type { AppProps } from 'next/app'; // Import AppProps type
    import '../styles/globals.css'; // Make sure this path is correct if you have a globals.css

    function MyApp({ Component, pageProps }: AppProps) {
      return <Component {...pageProps} />;
    }

    export default MyApp;
    