import { Partners } from "../../src/components/component";
import DownloadAppBanner from "../../src/components/crypto/DownloadAppBanner";
import FancyBlock from "../../src/components/crypto/FancyBlock";
import Feature from "../../src/components/crypto/feature";
import WalletFeature from "../../src/components/crypto/wallet-feature";
import NeedHelpBlock from "../../src/components/crypto/nee-help-block";
import Hero_10 from "../../src/components/hero/hero_10";
import Meta from "../../src/components/Meta";
import Testimonial from "../../src/components/testimonial/testimonial";

const Home_1 = () => {
  return (
    <main>
      <Meta title="Home 10 || MotM | NFT Marketplace" />
      <Hero_10 />
      <Feature />
      <FancyBlock />
      <Partners />
      <WalletFeature />
      <Testimonial />
      <DownloadAppBanner />
      <NeedHelpBlock />
    </main>
  );
};

export default Home_1;
