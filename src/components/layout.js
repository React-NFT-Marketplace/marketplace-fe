import Footer from "./footer";
import Wallet_modal from "./modal/wallet_modal";
import ListModal from "./modal/listModal";
import DelistModal from "./modal/delistModal";
import BuyModal from "./modal/buyModal";
import { useRouter } from "next/router";
import Header01 from "./header/Header01";

export default function Layout({ children, handleChainChange, handleAccountChange }) {
  const route = useRouter();

  return (
    <>
      <Header01 handleChainChange={handleChainChange} handleAccountChange={handleAccountChange}/>
      <Wallet_modal />
      <ListModal />
      <BuyModal />
      <DelistModal />
      <main>{children}</main>
      <Footer />
    </>
  );
}
