import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import Layout from "../src/components/layout";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useRouter } from "next/router";
import { MetaMaskProvider } from "metamask-react";
import Meta from "../src/components/Meta";
import UserContext from "../src/components/UserContext";
import { useEffect, useState, useRef } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pid = router.asPath;
  const scrollRef = useRef({
    scrollPos: 0,
  });

  const [chain, setChain] = useState(); //network version
  const [account, setAccount] = useState();

  useEffect(() => {
    // if (pid === '/home/home_8') {
    // 	const html = document.querySelector('html');
    // 	html.classList.remove('light');
    // 	html.classList.add('dark');
    // }
  }, []);

  return (
    <>
      <Meta title="MotM | NFT Marketplace" />

      <Provider store={store}>
        <ThemeProvider enableSystem={true} attribute="class">
          <MetaMaskProvider>
            <UserContext.Provider value={{ scrollRef: scrollRef, chain, account }}>
              {pid === "/login" ? (
                <Component {...pageProps} />
              ) : (
                <Layout handleChainChange={(chainId) => { setChain(chainId) }} handleAccountChange={(account) => { setAccount(account) }}>
                  <Component {...pageProps} />
                </Layout>
              )}
              <ToastContainer />
            </UserContext.Provider>
          </MetaMaskProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
